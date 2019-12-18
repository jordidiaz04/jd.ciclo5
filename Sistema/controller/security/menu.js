var idMenu = '';
var type = 1;
var menus = [];
var submenus = [];

$(document).ready(function () {
    console.log('security/menu');
    getAllMenus(fillTableMenus);
});

function fillTableMenus() {
    $('#tbMenu').html('');
    menus.forEach(menu => {
        $('#tbMenu').append(
            '<tr>' +
            '<td>' + menu.title + '</td>' +
            '<td>' +
            '<i class="' + menu.icon + '"></i> ' +
            menu.icon +
            '</td>' +
            '<td></td>' +
            '<td>' +
            '<button type="button" class="btn btn-success waves-effect waves-light mr-2" onclick="editMenu(\'' + menu.id + '\')"> <i class="icon-pencil"></i> </button>' +            
            '</td>' +
            '</tr>'
        );
        fillTableSubmenus(menu.id);
    });
    fillAllInputs();
    hideLoader();
}
function fillTableSubmenus(idMenu) {
    submenus.forEach(submenu => {
        if (submenu.menu === idMenu) {
            $('#tbMenu').append(
                '<tr>' +
                '<td>' + submenu.title + '</td>' +
                '<td></td>' +
                '<td>' + submenu.url + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-success waves-effect waves-light mr-2" onclick="editSubmenu(\'' + submenu.id + '\')"> <i class="icon-pencil"></i> </button>' +
                '<button type="button" class="btn btn-danger waves-effect waves-light mr-2" onclick="deleteSubmenu(\'' + submenu.id + '\')"> <i class="icon-trash"></i> </button>' +
                '</td>' +
                '</tr>'
            );
        }
    });
}
function fillAllInputs() {
    $('#cboMenu').html('');
    menus.forEach(menu => {
        $('#cboMenu').append(
            '<option value="' + menu.id + '">' + menu.title + '</option>'
        );
    });
}
function create(id) {
    enable('btnSave');
    idMenu = '';
    type = id;
    clearInputs('modalMenu');
    switch (id) {
        case 1:
            $('#divMenu').addClass('d-none');
            $('#modalTitle').html('Nuevo menu');
            $('#lblIconUrl').html('Icono:');
            break;
        case 2:
            $('#divMenu').removeClass('d-none');
            $('#modalTitle').html('Nuevo submenu');
            $('#lblIconUrl').html('Ruta:');
            break;
    }
    $('#modalMenu').modal('show');
}
function editMenu(id) {
    enable('btnSave');
    clearInputs('modalMenu');
    idMenu = id;
    type = 1;
    $('#divMenu').addClass('d-none');
    $('#modalMenu').modal('show');
    $('#modalTitle').html('Editar menu');
    $('#lblIconUrl').html('Icono:');

    let menu = menus.find(function (menu) {
        return menu.id === id;
    });

    $('#txtTitle').val(menu.title)
    $('#txtIconUrl').val(menu.icon);
}
function editSubmenu(id) {
    enable('btnSave');
    clearInputs('modalMenu');
    idMenu = id;
    type = 2;
    $('#divMenu').removeClass('d-none');
    $('#modalMenu').modal('show');
    $('#modalTitle').html('Editar submenu');
    $('#lblIconUrl').html('Ruta:');

    let submenu = submenus.find(function (submenu) {
        return submenu.id === id;
    });

    $('#cboMenu').val(submenu.menu);
    $('#txtTitle').val(submenu.title)
    $('#txtIconUrl').val(submenu.url);
}
function deleteSubmenu(id) {
    sendQuestionMessage('¿Desea eliminar el submenu?', 'Una vez eliminado no podrá recuperarlo', function () {
        dbSubmenus.doc(id).delete().then(function () {
            sendSuccessMessage('Mensaje al usuario', 'Submenu eliminado');
        }).catch(function (error) {
            sendErrorMessage('Mensaje de error', 'No se pudo eliminar el submenu');
        });
    });
}
function save() {
    if (validateInputs()) {
        disable('btnSave');
        var docData = {};
        var ref;

        docData.author = user.id;
        docData.title = $('#txtTitle').val();
        if (type === 1) {
            docData.icon = $('#txtIconUrl').val();
            ref = dbMenus;
        }
        else {
            docData.menu = $('#cboMenu').val();
            docData.url = $('#txtIconUrl').val();
            ref = dbSubmenus;
        }

        if (idMenu === '') {
            ref.add(docData)
                .then(function (document) {
                    $('#modalMenu').modal('hide');
                    sendSuccessMessage('Mensaje al usuario', 'Registro exitoso');
                })
                .catch(function (error) {
                    sendErrorMessage('Mensaje de error', 'No se pudo completar el registro');
                });
        }
        else {
            ref.doc(idMenu).update(docData)
                .then(function () {
                    $('#modalMenu').modal('hide');
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
    if (checkInput('txtIconUrl')) result = false;
    if (type === 2) if (checkInput('cboMenu')) result = false;

    return result;
}