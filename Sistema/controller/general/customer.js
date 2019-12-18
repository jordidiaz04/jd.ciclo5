var idCustomer = '';
var customers = [];

$(document).ready(function () {
    console.log('general/customer');
    getAllCustomers();
});

function getAllCustomers() {
    dbCustomers.onSnapshot(function (docs) {
        customers = [];
        docs.forEach(doc => {
            let customer = doc.data();
            customer.id = doc.id;
            customers.push(customer);
        });

        fillUbigeo('cboDepartment', 'cboProvince', 'cboDistrict', 'Lima', 'Lima', 'Lima');
        fillTableCustomers();
    });
}
function fillTableCustomers() {
    $('#tbCustomer').html('');
    customers.forEach(customer => {
        $('#tbCustomer').append(
            '<tr>' +
            '<td>' + customer.documentType + '</td>' +
            '<td>' + customer.id + '</td>' +
            '<td>' + customer.businessName + '</td>' +
            '<td>' + customer.email + '</td>' +
            '<td>' + customer.phone + '</td>' +
            '<td class="text-center">' +
            '<button type="button" class="btn btn-success waves-effect waves-light mr-2" onclick="editCustomer(\'' + customer.id + '\')"> <i class="icon-pencil"></i> </button>' +
            '</td>' +
            '</tr>'
        );
    });

    hideLoader();
}
function create() {
    enable('btnSave');
    idCustomer = '';
    clearInputs('modalCustomer');
    fillUbigeo('cboDepartment', 'cboProvince', 'cboDistrict', 'Lima', 'Lima', 'Lima');
    $('#modalTitle').html('Nuevo cliente');
    $('#modalCustomer').modal('show');
}
function editCustomer(id) {
    enable('btnSave');
    clearInputs('modalCustomer');
    idCustomer = id;
    $('#modalCustomer').modal('show');
    $('#modalTitle').html('Editar cliente');

    let customer = customers.find(function (customer) {
        return customer.id === id;
    });

    $('#cboTDoc').val(customer.documentType)
    $('#txtNDoc').val(customer.id);
    $('#txtName').val(customer.businessName);
    $('#txtEmail').val(customer.email);
    $('#txtAddress').val(customer.address);
    $('#txtPhone').val(customer.phone);

    let idDepa = customer.ubigeo.split('/')[0];
    let idProv = customer.ubigeo.split('/')[1];
    let idDist = customer.ubigeo.split('/')[2];
    fillUbigeo('cboDepartment', 'cboProvince', 'cboDistrict', idDepa, idProv, idDist);
}
function save() {
    if (validateInputs()) {
        disable('btnSave');
        var docData = {};
        docData.author = user.id;
        docData.documentType = $('#cboTDoc').val();
        docData.businessName = $('#txtName').val();
        docData.email = $('#txtEmail').val();
        docData.address = $('#txtAddress').val();
        docData.phone = $('#txtPhone').val();
        docData.ubigeo = $('#cboDepartment').val() + '/' + $('#cboProvince').val() + '/' + $('#cboDistrict').val();

        if (idCustomer === '') {
            idCustomer = $('#txtNDoc').val();
            dbCustomers.doc(idCustomer).set(docData)
                .then(function (document) {
                    $('#modalCustomer').modal('hide');
                    sendSuccessMessage('Mensaje al usuario', 'Registro exitoso');
                })
                .catch(function (error) {
                    sendErrorMessage('Mensaje de error', 'No se pudo completar el registro');
                });
        }
        else {
            dbCustomers.doc(idCustomer).update(docData)
                .then(function () {
                    $('#modalCustomer').modal('hide');
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
    if (checkInput('txtAddress')) result = false;
    if (checkInput('txtPhone')) result = false;

    return result;
}