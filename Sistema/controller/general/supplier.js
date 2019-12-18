var idSupplier = '';
var suppliers = [];
var addresses = [];

$(document).ready(function () {
    console.log('general/supplier');
    getAllSuppliers();
});

function getAllSuppliers() {
    dbSuppliers.onSnapshot(function (docs) {
        suppliers = [];
        docs.forEach(doc => {
            let supplier = doc.data();
            supplier.id = doc.id;
            suppliers.push(supplier);
        });

        fillUbigeo('cboDepartment', 'cboProvince', 'cboDistrict', 'Lima', 'Lima', 'Lima');
        fillTableSuppliers();
    });
}
function fillTableSuppliers() {
    $('#tbSupplier').html('');
    suppliers.forEach(supplier => {
        $('#tbSupplier').append(
            '<tr>' +
            '<td>' + supplier.documentType + '</td>' +
            '<td>' + supplier.id + '</td>' +
            '<td>' + supplier.businessName + '</td>' +
            '<td>' + supplier.email + '</td>' +
            '<td>' + supplier.phone + '</td>' +
            '<td class="text-center">' +
            '<button type="button" class="btn btn-success waves-effect waves-light mr-2" onclick="editSupplier(\'' + supplier.id + '\')"> <i class="icon-pencil"></i> </button>' +
            '</td>' +
            '</tr>'
        );
    });

    hideLoader();
}
function create() {
    enable('btnSave');
    idSupplier = '';
    addresses = [];
    $('#tbAddress').html('');
    clearInputs('modalSupplier');
    fillUbigeo('cboDepartment', 'cboProvince', 'cboDistrict', 'Lima', 'Lima', 'Lima');
    $('#modalTitle').html('Nuevo proveedor');
    $('#modalSupplier').modal('show');
}
function editSupplier(id) {
    enable('btnSave');
    clearInputs('modalSupplier');
    addresses = [];
    idSupplier = id;
    $('#modalSupplier').modal('show');
    $('#modalTitle').html('Editar proveedor');

    let supplier = suppliers.find(function (supplier) {
        return supplier.id === id;
    });

    $('#cboTDoc').val(supplier.documentType)
    $('#txtNDoc').val(supplier.id);
    $('#txtName').val(supplier.businessName);
    $('#txtEmail').val(supplier.email);
    $('#txtPhone').val(supplier.phone);

    fillUbigeo('cboDepartment', 'cboProvince', 'cboDistrict', 'Lima', 'Lima', 'Lima');
    addresses = supplier.address;
    fillTableAddress();
}
function addAddress() {
    let obj = {};
    obj.ubigeo = $('#cboDepartment').val() + '/' + $('#cboProvince').val() + '/' + $('#cboDistrict').val();
    obj.address = $('#txtAddress').val();

    let address = addresses.find(function (address) {
        return address.ubigeo === obj.ubigeo && address.address === obj.address;
    });

    if (address === undefined) {
        addresses.push(obj);
        fillTableAddress();
    }
    $('#txtAddress').val('');
}
function fillTableAddress() {
    $('#tbAddress').html('');
    addresses.forEach(address => {
        $('#tbAddress').append(
            '<tr>' +
            '<td>' + address.ubigeo + '</td>' +
            '<td>' + address.address + '</td>' +
            '<td class="text-center">' +
            '<button type="button" class="btn btn-danger waves-effect waves-light mr-2" onclick="deleteAddress(\'' + address.ubigeo + '\', \'' + address.address + '\')"> <i class="icon-trash"></i> </button>' +
            '</td>' +
            '</tr>'
        );
    });
}
function deleteAddress(ubigeo, addr) {
    addresses = addresses.filter(function (address) {
        return address.ubigeo !== ubigeo || address.address !== addr;
    });
    fillTableAddress();
}
function save() {
    if (validateInputs()) {
        disable('btnSave');
        var docData = {};
        docData.author = user.id;
        docData.documentType = $('#cboTDoc').val();
        docData.businessName = $('#txtName').val();
        docData.email = $('#txtEmail').val();
        docData.address = addresses;
        docData.phone = $('#txtPhone').val();

        if (idSupplier === '') {
            idSupplier = $('#txtNDoc').val();
            dbSuppliers.doc(idSupplier).set(docData)
                .then(function (document) {
                    $('#modalSupplier').modal('hide');
                    sendSuccessMessage('Mensaje al usuario', 'Registro exitoso');
                })
                .catch(function (error) {
                    sendErrorMessage('Mensaje de error', 'No se pudo completar el registro');
                });
        }
        else {
            dbSuppliers.doc(idSupplier).update(docData)
                .then(function () {
                    $('#modalSupplier').modal('hide');
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
    if (checkInput('txtPhone')) result = false;

    return result;
}   