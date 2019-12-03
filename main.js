document.getElementById("datehoy").innerHTML = new Date

var dataA1 = []
var dataA2 = [12,22,23,23,23,12,12]
var dataA3 = [22,12,12,16,21,23,21]
var dataA4 = [21,20,10,16,24,22,15]

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
    var tempCPU = data.val().cpu || '0'
    var tempAr = data.val().arduino || '0'
    var alarma = data.val().alarma || false
    var servo = data.val().servo

    document.getElementById("tempCPU"+numDiv).innerHTML = tempCPU + "°C"
    document.getElementById("tempArduino"+numDiv).innerHTML = tempAr + "°C"
    document.getElementById("servo"+numDiv).innerHTML = servo + "°"
    if(alarma){
      document.getElementById("alarmaEstado"+numDiv).checked = true
    } else {
      document.getElementById("alarmaEstado"+numDiv).checked = false
    }
  })
}

function getHistorialDataFromFirebase(){
  var refData = firebase.database().ref(nomArduino).limitToLast(7)
  refData.on('value', function(data){
    // coger nombre de da
    var key = Object.keys(data.val())[0]
    console.log(key)
    console.log(data.length);
    var tempCPU = data.val().cpu || '0'
    var tempAr = data.val().arduino || '0'
    var alarma = data.val().alarma || false

    dataA1 = tempCPU

    document.getElementById("tempCPU"+numDiv).innerHTML = tempCPU
    document.getElementById("tempArduino"+numDiv).innerHTML = tempAr
    if(alarma){
      document.getElementById("alarmaEstado"+numDiv).classList.add('checked')
    } else {
      document.getElementById("alarmaEstado"+numDiv).classList.remove('checked')
    }
  })
}

//CHARTS

chartt("myChart1",dataA1,dataA2,dataA3,dataA4)
chartt("myChart2",dataA2,dataA4,dataA1,dataA3)

function chartt(div, data1, data2, data3, data4){
    new Chart(document.getElementById(div), {
    type: 'line',
    data: {
    labels: [60,50,40,30,20,10,0],
    datasets: [{ 
        data: data1,
        label: "Arduino 1",
        borderColor: "#00d1b2",
        fill: false
        }, { 
        data: data2,
        label: "Arduino 2",
        borderColor: "#ffdd57",
        fill: false
        }, { 
        data: data3,
        label: "Arduino 3",
        borderColor: "#3298dc",
        fill: false
        }, { 
        data: data4,
        label: "Arduino 4",
        borderColor: "#f14668",
        fill: false
        }
    ]
    },
    options: {
    title: {
        display: true,
        text: 'Temperatura Arduinos en Centigrados'
    }
    }
    });
}
