// Create a client instance: Broker, Port, Websocket Path, Client ID
client = new Paho.MQTT.Client("broker.mqttdashboard.com", Number(8000), "clientId-demo-equipo3");

// set callback handlers
client.onConnectionLost = function (responseObject) {
    console.log("Connection Lost: "+responseObject.errorMessage);
}

// Called when the connection is made
function onConnect(){
	console.log('Connected!');
	
}

// Connect the client, with a Username and Password
client.connect({
	onSuccess: onConnect, 
	userName : "admin",
	password : "admin"
});

function sendAlerta() {
	// Publish a Message
	if (data == "ON"){
		var message = new Paho.MQTT.Message("OFF");
		message.destinationName = "proyecto/device/grupo2/alarma/estado";
		message.qos = 0;
		message.retained = false;
		client.send(message);
	}
	else {
		var message = new Paho.MQTT.Message("ON");
		message.destinationName = "proyecto/device/grupo2/alarma/estado";
		message.qos = 0;
		message.retained = false;
		client.send(message);
	}

	console.log(data);
	
	client.subscribe("proyecto/device/grupo2/alarma");
}
client.onMessageArrived = function (message) {
	var data = message.payloadString+""
	if (data == "ON"){
		document.getElementById("alarma").innerHTML = "ALARMA PRENDIDA";
	}
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0) {
	  console.log("onConnectionLost:"+responseObject.errorMessage);
	}
  }
  
  // called when a message arrives
  function onMessageArrived(message) {
	console.log("onMessageArrived:"+message.payloadString);
  }

