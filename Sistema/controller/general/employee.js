var idEmployee = '';
var employees = [];
var profiles = [];

$('#txtBirthDate').datepicker({
    autoclose: true,
    todayHighlight: true
});

$(document).ready(function () {
    console.log('general/employee');
    getAllInputs();
});

function getAllInputs() {
    dbProfiles.onSnapshot(function (snapshot) {
        profiles = [];
        snapshot.forEach(function (doc) {
            let profile = doc.data();
            profile.id = doc.id;
            profiles.push(profile);
        });
        getAllEmployees();
    });
}
function getAllEmployees() {
    dbEmployees.onSnapshot(function (docs) {
        employees = [];
        docs.forEach(doc => {
            let employee = doc.data();
            employee.id = doc.id;
            employees.push(employee);
        });

        fillInputs();
        fillTableEmployees();
    });
}
function fillInputs() {
    $('#cboProfile').html('');
    profiles.forEach(profile => {
        $('#cboProfile').append(
            '<option value="' + profile.id + '">' + profile.title + '</option>'
        );
    });

    fillUbigeo('cboDepartment', 'cboProvince', 'cboDistrict', 'Lima', 'Lima', 'Lima');
}
function fillTableEmployees() {
    $('#tbEmployee').html('');
    employees.forEach(employee => {
        $('#tbEmployee').append(
            '<tr>' +
            '<td>' + employee.documentType + '</td>' +
            '<td>' + employee.id + '</td>' +
            '<td>' + employee.fullName + '</td>' +
            '<td>' + employee.email + '</td>' +
            '<td>' + employee.phone + '</td>' +
            '<td class="text-center">' +
            '<button type="button" class="btn btn-success waves-effect waves-light mr-2" onclick="editEmployee(\'' + employee.id + '\')"> <i class="icon-pencil"></i> </button>' +
            '</td>' +
            '</tr>'
        );
    });

    hideLoader();
}
function create() {
    enable('btnSave');
    idEmployee = '';
    clearInputs('modalEmployee');
    fillUbigeo('cboDepartment', 'cboProvince', 'cboDistrict', 'Lima', 'Lima', 'Lima');
    $('#modalTitle').html('Nuevo personal');
    $('#modalEmployee').modal('show');
}
function editEmployee(id) {
    enable('btnSave');
    clearInputs('modalEmployee');
    idEmployee = id;
    $('#modalEmployee').modal('show');
    $('#modalTitle').html('Editar personal');

    let employee = employees.find(function (employee) {
        return employee.id === id;
    });

    $('#cboTDoc').val(employee.documentType)
    $('#txtNDoc').val(employee.id);
    $('#txtBirthDate').val(convertTimestampToDate(employee.birthDate));
    $('#txtName').val(employee.fullName);
    $('#txtEmail').val(employee.email);
    $('#txtAddress').val(employee.address);
    $('#txtPhone').val(employee.phone);
    $('#cboMStat').val(employee.maritalStatus);
    $('#cboProfile').val(employee.profile);

    let idDepa = employee.ubigeo.split('/')[0];
    let idProv = employee.ubigeo.split('/')[1];
    let idDist = employee.ubigeo.split('/')[2];
    fillUbigeo('cboDepartment', 'cboProvince', 'cboDistrict', idDepa, idProv, idDist);

    if (employee.gender === 'M') $('#rbMale').prop('checked', true);
    else $('#rbFemale').prop('checked', true);
}
function save() {
    if (validateInputs()) {
        disable('btnSave');
        var docData = {};
        docData.author = user.id;
        docData.documentType = $('#cboTDoc').val();
        docData.birthDate = new Date($('#txtBirthDate').val());
        docData.fullName = $('#txtName').val();
        docData.email = $('#txtEmail').val();
        docData.address = $('#txtAddress').val();
        docData.phone = $('#txtPhone').val();
        docData.maritalStatus = $('#cboMStat').val();
        docData.profile = $('#cboProfile').val();
        docData.gender = $('#rbMale').prop('checked') ? 'M' : 'F';
        docData.ubigeo = $('#cboDepartment').val() + '/' + $('#cboProvince').val() + '/' +$('#cboDistrict').val();

        if (idEmployee === '') {
            idEmployee = $('#txtNDoc').val();
            dbEmployees.doc(idEmployee).set(docData)
                .then(function (document) {
                    $('#modalEmployee').modal('hide');
                    sendSuccessMessage('Mensaje al usuario', 'Registro exitoso');
                })
                .catch(function (error) {
                    sendErrorMessage('Mensaje de error', 'No se pudo completar el registro');
                });
        }
        else {
            dbEmployees.doc(idEmployee).update(docData)
                .then(function () {
                    $('#modalEmployee').modal('hide');
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
    if (checkInput('txtBirthDate')) result = false;
    if (checkInput('txtName')) result = false;
    if (checkInput('txtEmail')) result = false;
    if (checkInput('txtAddress')) result = false;
    if (checkInput('txtPhone')) result = false;

    return result;
}