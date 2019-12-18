$(document).ready(function () {
    $('#btnLogIn').click(function () {
        if (validateInputs()) {
            sendInformation();
        }
    });
});

function validateInputs() {
    var result = true;
    if (checkInput('txtUsername')) result = false;
    if (checkInput('txtPassword')) result = false;
    return result;
}
function sendInformation() {
    let user = $('#txtUsername').val().trim();
    getUserInformation(user, login);
}
function login(user) {
    let pass = $('#txtPassword').val();
    let remeber = $('#chbRemember').prop('checked');

    if (user.password === pass) {
        if (remeber) localStorage.setItem('USER', JSON.stringify(user));
        else sessionStorage.setItem('USER', JSON.stringify(user));
        location.replace("index.html");
    }
    else {
        sendInfoMessage('Mensaje al usuario', 'Usuario y/o contraseña incorrecta');
    }
}