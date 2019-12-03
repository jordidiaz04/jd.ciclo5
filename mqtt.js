var topic = "proyecto/device/";
var topic1 = "grupo1/";
var topic2 = "grupo2/";
var topic3 = "grupo3/";
var topic4 = "grupo4/";
var detailTopic = "alarma/estado";
var generalTopic = "";

// Create a client instance: Broker, Port, Websocket Path, Client ID
client = new Paho.MQTT.Client("broker.mqttdashboard.com", Number(8000), "clientId-demo-equipo3");

// set callback handlers
client.onConnectionLost = function (responseObject) {
	console.log("Connection Lost: " + responseObject.errorMessage);
}

// Called when the connection is made
function onConnect() {
	console.log('Connected!');

}

// Connect the client, with a Username and Password
client.connect({
	onSuccess: onConnect,
	userName: "admin",
	password: "admin"
});

function sendAlerta(obj) {
	switch (obj.getAttribute('data-id')) {
		case '1':
			generalTopic = topic + topic1 + detailTopic;
			break;
		case '2':
			generalTopic = topic + topic2 + detailTopic;
			break;
		case '3':
			generalTopic = topic + topic3 + detailTopic;
			break;
		case '4':
			generalTopic = topic + topic4 + detailTopic;
			break;
	}

	let value = obj.checked ? "ON" : "OFF";
	var message = new Paho.MQTT.Message(value);
	message.destinationName = generalTopic;
	message.qos = 0;
	message.retained = false;
	client.send(message);
	client.subscribe("proyecto/device/grupo2/alarma");
}

function sendServo(obj){
	switch (obj.getAttribute('data-id')) {
		case '1':
			generalTopic = topic + topic1 + detailTopic;
			break;
		case '2':
			generalTopic = topic + topic2 + detailTopic;
			break;
		case '3':
			generalTopic = topic + topic3 + detailTopic;
			break;
		case '4':
			generalTopic = topic + topic4 + detailTopic;
			break;
	}

	let value = obj.checked ? "ON" : "OFF";
	var message = new Paho.MQTT.Message(value);
	message.destinationName = generalTopic;
	message.qos = 0;
	message.retained = false;
	client.send(message);
}


client.onMessageArrived = function (message) {
	var data = message.payloadString + ""
	if (data == "ON") {
		document.getElementById("alarma").innerHTML = "ALARMA PRENDIDA";
	}
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0) {
		console.log("onConnectionLost:" + responseObject.errorMessage);
	}
}

// called when a message arrives
function onMessageArrived(message) {
	console.log("onMessageArrived:" + message.payloadString);
}

