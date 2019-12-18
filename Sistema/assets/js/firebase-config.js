var firebaseConfig = {
    apiKey: 'AIzaSyACi-ivHr8RmyjaHFnvyMtw4KlW3fI2QNM',
    authDomain: 'jd-bodega.firebaseapp.com',
    databaseURL: 'https://jd-bodega.firebaseio.com',
    projectId: 'jd-bodega',
    storageBucket: 'jd-bodega.appspot.com',
    messagingSenderId: '407959561250',
    appId: '1:407959561250:web:c580468549a317ca5d967b',
    measurementId: 'G-Q410JJC5TW'
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();
var dbUsers = db.collection('users');
var dbMenus = db.collection('menus');
var dbSubmenus = db.collection('submenus');
var dbProfiles = db.collection('profiles');
var dbMenusSubmenus = db.collection('menus_submenus');
var dbEmployees = db.collection('employees');
var dbUbigeo = db.collection('ubigeo');
var dbCustomers = db.collection('customers');
var dbSuppliers = db.collection('suppliers');