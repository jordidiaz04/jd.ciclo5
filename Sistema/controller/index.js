var user = getUserSession();
var arrayMenus = [];
var arraySubmenus = [];

$(document).ready(function () {
    getUbigeo();
    if (user == null) location.replace("login.html");
    showUserInformation();
    getAllMenus(getMenusByProfile);
});

function showUserInformation() {
    $('#lblName').text(user.fullName);
    $('#lblEmail').text(user.email);
}
function getMenusByProfile() {
    dbProfiles.doc(user.profile.trim()).onSnapshot(function (doc) {
        let data = doc.data().access;
        let idMenus = Object.keys(data);
        let idSubmenus = [];

        idMenus.forEach(idMenu => {
            idSubmenus.push(Object.keys(data[idMenu]))
        });
        getMenus(idMenus, idSubmenus);
    });
}
function getMenus(idMenus, idSubmenus) {
    arrayMenus = [];
    for (let i = 0; i < idMenus.length; i++) {
        let menu = menus.find(function (menu) {
            return menu.id === idMenus[i];
        });
        arrayMenus.push(menu);
    }
    getSubmenus(idSubmenus);
}
function getSubmenus(idSubmenus) {
    arraySubmenus = [];
    for (let i = 0; i < idSubmenus.length; i++) {
        for (let j = 0; j < idSubmenus[i].length; j++) {
            let submenu = submenus.find(function (submenu) {
                return submenu.id === idSubmenus[i][j];
            });
            arraySubmenus.push(submenu);
        }
    }
    arraySubmenus.sort(function (a, b) {
        return a.title.localeCompare(b.title);
    });

    fillMenus();
    hideLoader();
}
function fillMenus() {
    $('#ulMenu').html('');
    arrayMenus.forEach(menu => {
        $('#ulMenu').append(
            '<li>' +
            '<a href="javascript:void();" class="waves-effect">' +
            '<i class="' + menu.icon + '"></i>' +
            ' <span>' + menu.title + '</span>' +
            '<i class="fa fa-angle-left pull-right"></i>' +
            '</a>' +
            fillSubmenus(menu.id) +
            '</li>'
        );
    });
}
function fillSubmenus(idMenu) {
    let text = '<ul class="sidebar-submenu">';
    arraySubmenus.forEach(submenu => {
        if (submenu.menu === idMenu) {
            text += '<li onclick="openMenu(\'' + submenu.url + '\')"><a href="javascript:void()"><i>';
            text += submenu.title.substr(0, 1);
            text += '</i> ' + submenu.title + '</a></li>';
        }
    });
    text += '</ul>';
    return text;
}
function openMenu(url) {
    $("#content").load(url);
}
function logout() {
    localStorage.removeItem('USER');
    sessionStorage.removeItem('USER');
    location.replace("login.html");
}