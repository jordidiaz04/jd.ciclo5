var idUser = '';
var users = [];
var profiles = [];

$(document).ready(function () {
    console.log('general/user');
    getAllInputs();
    $('#txtNDoc').keypress(function (e) {
        if (e.which == 13) {
            let idEmployee = $('#txtNDoc').val();
            getEmployeeInformation(idEmployee);
        }
    });
});

function getAllInputs() {
    dbProfiles.onSnapshot(function (snapshot) {
        profiles = [];
        snapshot.forEach(function (doc) {
            let profile = doc.data();
            profile.id = doc.id;
            profiles.push(profile);
        });
        getAllUsers();
    });
}
function getAllUsers() {
    dbUsers.onSnapshot(function (docs) {
        users = [];
        docs.forEach(doc => {
            let user = doc.data();
            user.id = doc.id;
            user.profile = profiles.find(function (profile) {
                return profile.id === user.profile;
            });
            users.push(user);
        });

        fillInputs();
        fillTableUsers();
    });
}
function fillInputs() {
    $('#cboProfile').html('');
    profiles.forEach(profile => {
        $('#cboProfile').append(
            '<option value="' + profile.id + '">' + profile.title + '</option>'
        );
    });
}
function fillTableUsers() {
    $('#tbUser').html('');
    users.forEach(user => {
        $('#tbUser').append(
            '<tr>' +
            '<td>' + user.id + '</td>' +
            '<td>' + user.fullName + '</td>' +
            '<td>' + user.email + '</td>' +
            '<td>' + user.profile.title + '</td>' +
            '<td class="text-center">' +
            '<button type="button" class="btn btn-success waves-effect waves-light mr-2" onclick="editUser(\'' + user.id + '\')"> <i class="icon-pencil"></i> </button>' +
            '</td>' +
            '</tr>'
        );
    });

    hideLoader();
}
function getEmployeeInformation(idEmployee) {
    dbEmployees.doc(idEmployee).get().then(function (doc) {
        if (doc.exists) {
            $('#txtName').val(doc.data().fullName);
            $('#txtEmail').val(doc.data().email);
            $('#cboProfile').val(doc.data().profile);
        } else {
            $('#txtName').val('');
            sendInfoMessage('Mensaje al usuario', 'No existe datos para el documento ingresado');
        }
    }).catch(function (error) {
        $('#txtName').val('');
        sendErrorMessage('Mensaje de error', 'No se pudo obtener la información del usuario');
    });
}
function create() {
    enable('btnSave');
    idUser = '';
    clearInputs('modalUser');
    $('#modalTitle').html('Nuevo usuario');
    $('#modalUser').modal('show');
}
function editUser(id) {
    enable('btnSave');
    clearInputs('modalUser');
    idUser = id;
    $('#modalUser').modal('show');
    $('#modalTitle').html('Editar usuario');

    let user = users.find(function (user) {
        return user.id === id;
    });

    $('#txtNDoc').val(user.id);
    $('#txtName').val(user.fullName);
    $('#txtEmail').val(user.email);
    $('#txtPassword').val(user.password);
    $('#cboProfile').val(user.profile.id);
}
function save() {
    if (validateInputs()) {
        disable('btnSave');
        var docData = {};
        docData.author = user.id;
        docData.fullName = $('#txtName').val();
        docData.email = $('#txtEmail').val();
        docData.profile = $('#cboProfile').val();
        docData.password = $('#txtPassword').val();

        if (idUser === '') {
            idUser = $('#txtNDoc').val();
            dbUsers.doc(idUser).set(docData)
                .then(function (document) {
                    $('#modalUser').modal('hide');
                    sendSuccessMessage('Mensaje al usuario', 'Registro exitoso');
                })
                .catch(function (error) {
                    sendErrorMessage('Mensaje de error', 'No se pudo completar el registro');
                });
        }
        else {
            dbUsers.doc(idUser).update(docData)
                .then(function () {
                    $('#modalUser').modal('hide');
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
    if (checkInput('txtNDoc')) result = false;
    if (checkInput('txtName')) result = false;
    if (checkInput('txtEmail')) result = false;
    if (checkInput('txtPassword')) result = false;

    return result;
}