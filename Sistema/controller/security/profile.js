var idProfile = '';
var profiles = [];

$(document).ready(function () {
    console.log('security/profile');
    fillAllInputs();
});

function getAllProfiles() {
    dbProfiles.onSnapshot(function (docs) {
        profiles = [];
        docs.forEach(doc => {
            let profile = doc.data();
            profile.id = doc.id;
            profiles.push(profile);

            if (profiles.length == docs.size) { fillTableProfiles(); }
        });
    });
}
function fillTableProfiles() {
    $('#tbProfile').html('');
    profiles.forEach(profile => {
        $('#tbProfile').append(
            '<tr>' +
            '<td>' + profile.title + '</td>' +
            '<td>' + profile.description + '</td>' +
            '<td class="text-center">' +
            '<button type="button" class="btn btn-success waves-effect waves-light mr-2" onclick="editProfile(\'' + profile.id + '\')"> <i class="icon-pencil"></i> </button>' +
            '<button type="button" class="btn btn-dark waves-effect waves-light mr-2" onclick="setAccess(\'' + profile.id + '\')"> Accesos </button>' +
            '</td>' +
            '</tr>'
        );
    });
    hideLoader();
}
function fillAllInputs() {
    menus.forEach(menu => {
        $('#divAccess').append(
            '<div class="col-sm-4">' +
            '<div class="icheck-primary">' +
            '<input type="checkbox" data-type="menu" data-id="' + menu.id + '" id="menu-' + menu.id + '" onchange="selectAllByMenu(\'' + menu.id + '\', this);" />' +
            '<label for="menu-' + menu.id + '" class="font-weight-bold">' + menu.title + '</label>' +
            '</div>' +
            '<div class="ml-3">' +
            fillProfileSubmenus(menu.id) +
            '</div>' +
            '</div>'
        );
    });
    getAllProfiles();
}
function fillProfileSubmenus(idMenu) {
    let text = '';
    submenus.forEach(submenu => {
        if (submenu.menu === idMenu) {
            text += '<div class="icheck-primary">' +
                '<input type="checkbox" data-type="submenu" data-id="' + idMenu + '" id="submenu-' + submenu.id + '" />' +
                '<label for="submenu-' + submenu.id + '">' + submenu.title + '</label>' +
                '</div>';
        }
    });

    return text;
}
function create() {
    enable('btnSave');
    idProfile = '';
    clearInputs('modalProfile');
    $('#modalTitle').html('Nuevo perfil');
    $('#modalProfile').modal('show');
}
function editProfile(id) {
    enable('btnSave');
    clearInputs('modalProfile');
    idProfile = id;
    $('#modalProfile').modal('show');
    $('#modalTitle').html('Editar perfil');

    let profile = profiles.find(function (profile) {
        return profile.id === id;
    });

    $('#txtTitle').val(profile.title)
    $('#txtDescription').val(profile.description);
}
function save() {
    if (validateInputs()) {
        disable('btnSave');
        var docData = {};
        docData.author = user.id;
        docData.title = $('#txtTitle').val();
        docData.description = $('#txtDescription').val();
        if (idProfile === '') {
            dbProfiles.add(docData)
                .then(function (document) {
                    $('#modalProfile').modal('hide');
                    sendSuccessMessage('Mensaje al usuario', 'Registro exitoso');
                })
                .catch(function (error) {
                    sendErrorMessage('Mensaje de error', 'No se pudo completar el registro');
                });
        }
        else {
            dbProfiles.doc(idProfile).update(docData)
                .then(function () {
                    $('#modalProfile').modal('hide');
                    sendSuccessMessage('Mensaje al usuario', 'Actualización exitosa');
                })
                .catch(function (error) {
                    sendErrorMessage('Mensaje de error', 'No se pudo completar la actualización');
                });
        }
    }
}
function validateInputs() {
    var result = true;
    if (checkInput('txtTitle')) result = false;
    if (checkInput('txtDescription')) result = false;

    return result;
}
function setAccess(id) {
    $('#modalAccess input:checkbox').removeAttr('checked');
    idProfile = id;

    let profile = profiles.find(function (profile) {
        return profile.id === id;
    });
    
    if (profile.access !== undefined) {
        let idMenus = Object.keys(profile.access);

        idMenus.forEach(idMenu => {
            $('#menu-' + idMenu).prop('checked', 'true');
            let idSubmenus = Object.keys(profile.access[idMenu]);
            idSubmenus.forEach(idSubmenu => {
                $('#submenu-' + idSubmenu).prop('checked', 'true');
            });
        });
    }

    enable('btnSaveAccess');
    $('#modalAccess').modal('show');
}
function selectAllByMenu(idMenu, obj) {
    if (obj.checked) $('#modalAccess input:checkbox[data-id=' + idMenu + ']').prop('checked', true);
    else $('#modalAccess input:checkbox[data-id=' + idMenu + ']').removeAttr('checked');
}
function saveAccess() {
    disable('btnSaveAccess');
    let text = '{';
    $('#modalAccess input:checkbox[data-type="menu"]').each(function (indexMenu, menu) {
        if (menu.checked) {
            let idMenu = menu.id.split('-')[1];

            text += '"' + idMenu + '": {';
            $('input:checkbox[data-type="submenu"]').each(function (indexSubmenu, submenu) {
                if (submenu.checked) {
                    let idSubmenu = submenu.id.split('-')[1];
                    if ($(submenu).data('id') === idMenu) {
                        text += '"' + idSubmenu + '": true,';
                    }
                }
            });
            text = text.slice(0, -1);
            text += '},';
        }
    });
    text = text.slice(0, -1);
    text += '}';

    var docData = {};
    docData.author = user.id;
    docData.access = JSON.parse(text);

    dbProfiles.doc(idProfile).update(docData)
        .then(function () {
            $('#modalAccess').modal('hide');
            sendSuccessMessage('Mensaje al usuario', 'Accesos asignados');
        }).catch(function (error) {
            sendErrorMessage('Mensaje de error', 'No se pudo asignar los accesos');
        })
}