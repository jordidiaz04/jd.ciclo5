var menus = [];
var submenus = [];
var ubigeos = [];

//Database
function getUserInformation(user, func) {
    dbUsers.doc(user).get().then(function (doc) {
        let objUser = doc.data();
        objUser.id = doc.id;
        func(objUser);
    }).catch(function (error) {
        sendInfoMessage('Mensaje al usuario', 'Usuario y/o contraseña incorrecta');
    });
}
function getAllMenus(func) {
    dbMenus.onSnapshot(function (docs) {
        menus = [];
        docs.forEach(doc => {
            let menu = doc.data();
            menu.id = doc.id;
            menus.push(menu);

            if (menus.length == docs.size) { getAllSubmenus(func); }
        });
    });
}
function getAllSubmenus(func) {
    dbSubmenus.orderBy("title").onSnapshot(function (docs) {
        submenus = [];
        docs.forEach(doc => {
            let submenu = doc.data();
            submenu.id = doc.id;
            submenus.push(submenu);

            if (submenus.length == docs.size) { func(); }
        });
    });
}
function getUbigeo() {
    dbUbigeo.onSnapshot(function (docs) {
        ubigeos = [];
        docs.forEach(doc => {
            let ubigeo = doc.data();
            ubigeo.id = doc.id;
            ubigeos.push(ubigeo);
        });
    });
}

//Session
function getUserSession() {
    let user = sessionStorage.getItem('USER') !== undefined ? JSON.parse(sessionStorage.getItem('USER')) :
        localStorage.getItem('USER') != undefined ? JSON.parse(localStorage.getItem('USER')) : null;
    return user;
}

//Elements
function hideLoader() {
    $('#loader-wrapper').addClass('fade-loader');
    $('#loader-inside-wrapper').addClass('fade-loader');
}
function enable(input) {
    $('#' + input).removeAttr('disabled');
}
function disable(input) {
    $('#' + input).attr('disabled', 'disabled');
}
function clearInputs(modal) {
    $('#' + modal + ' input').val('');    
    $('#' + modal + ' textarea').val('');
    $('#' + modal + ' select').prop('selectedIndex', 0);
}
function checkInput(input) {
    let val = $('#' + input).val().trim();
    if (val === '' || val === null || val === undefined) {
        $('#' + input).addClass('has-error');
        return true;
    }
    else {
        $('#' + input).removeClass('has-error');
        return false;
    }
}

//Messages
function sendMessage(title, text, icon) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text
    })
}
function sendSuccessMessage(title, text) {
    sendMessage(title, text, 'success');
}
function sendErrorMessage(title, text) {
    sendMessage(title, text, 'error');
}
function sendInfoMessage(title, text) {
    sendMessage(title, text, 'info');
}
function sendQuestionMessage(title, text, func) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Si'
    }).then((result) => {
        if (result.value) {
            func();
        }
    });
}

//Additional
function convertTimestampToDate(timestamp) {
    let dateString = new Date(new Date(1970, 0, 1).setSeconds(timestamp.seconds)).toLocaleDateString();
    let day = dateString.split('/')[0].length === 1 ? ('0' + dateString.split('/')[0]) : dateString.split('/')[0];
    let month = dateString.split('/')[1].length === 1 ? ('0' + dateString.split('/')[1]) : dateString.split('/')[1];
    let year = dateString.split('/')[2];
    let date = day + '/' + month + '/' + year;

    return date
}
function getDepartments() {
    let deparments = [];
    ubigeos.forEach(ubigeo => {
        deparments.push(ubigeo.id);
    });
    return deparments;
}
function getProvinces(idDepartment) {
    let provinces = [];
    ubigeos.forEach(ubigeo => {
        if (ubigeo.id === idDepartment) {
            provinces = Object.keys(ubigeo);
        }
    });
    provinces.pop();
    return provinces;
}
function getDistricts(idDepartment, idProvince) {
    let districts = [];
    ubigeos.forEach(ubigeo => {
        if (ubigeo.id === idDepartment) {
            districts = ubigeo[idProvince];
        }
    });
    return districts;
}
function fillDepartments(inputDepa) {
    let departments = getDepartments();
    $('#' + inputDepa).html('');
    departments.forEach(department => {
        $('#' + inputDepa).append(
            '<option value="' + department + '">' + department + '</option>'
        );
    });
}
function fillProvinces(inputDepa, inputProv) {
    $('#' + inputProv).html('');
    let idDepartment = $('#' + inputDepa).val();
    let provinces = getProvinces(idDepartment);
    provinces.forEach(province => {
        $('#' + inputProv).append(
            '<option value="' + province + '">' + province + '</option>'
        );
    });
}
function fillDistricts(inputDepa, inputProv, inputDist) {
    $('#' + inputDist).html('');
    let idDepartment = $('#' + inputDepa).val();
    let idProvince = $('#' + inputProv).val();
    let districts = getDistricts(idDepartment, idProvince);
    districts.forEach(district => {
        $('#' + inputDist).append(
            '<option value="' + district + '">' + district + '</option>'
        );
    });
}
function fillUbigeo(inputDepa, inputProv, inputDist, idDepa, idProv, idDist) {
    fillDepartments(inputDepa);
    $('#' + inputDepa).val(idDepa);
    fillProvinces(inputDepa, inputProv);
    $('#' + inputProv).val(idProv);
    fillDistricts(inputDepa, inputProv, inputDist);
    $('#' + inputDist).val(idDist);
}
