document.getElementById("datehoy").innerHTML = new Date

var firebaseConfig = {
    apiKey: "AIzaSyABJRFnIdfLyNCwvT1xg-gd-GNJzdpOpYA",
    authDomain: "bd-grupo-03.firebaseapp.com",
    databaseURL: "https://bd-grupo-03.firebaseio.com",
    projectId: "bd-grupo-03",
    storageBucket: "bd-grupo-03.appspot.com",
    messagingSenderId: "891548880702",
    appId: "1:891548880702:web:931da7894252d7f1e1266f",
    measurementId: "G-9H5KS8CCLQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var test = document.getElementById('test')

var arduinos = ["arduino1","arduino2","arduino3","arduino4"]
var arduinoDivs = ["divArduino1","divArduino2","divArduino3","divArduino4"]

var refData = firebase.database().ref('arduino1').limitToLast(100)

window.onload = (function(e) {
  for (i = 0 ; i < arduinos.length ; i++) {
  getDataFromFirebase(arduinos[i], i+1)
};
});



function getDataFromFirebase(nomArduino, numDiv){
var refData = firebase.database().ref(nomArduino).limitToLast(100)
refData.on('value', function(data){
  // coger nombre de da
  var key = Object.keys(data.val())[0]
  console.log(key)
  console.log(data.length);
  var tempCPU = data.val().Temperatura_Cpu || 'error'
  var tempAr = data.val().Temperatura_Arduino || 'error'
  var alarma = data.val().alarma || false

  document.getElementById("tempCPU"+numDiv).innerHTML = tempCPU
  document.getElementById("tempArduino"+numDiv).innerHTML = tempAr
  if(alarma){
    document.getElementById("alarmaEstado"+numDiv).classList.add('checked')
  } else {
    document.getElementById("alarmaEstado"+numDiv).classList.remove('checked')
  }
})
}