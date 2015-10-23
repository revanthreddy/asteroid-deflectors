var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var awsIot = require('aws-iot-device-sdk');

var device = awsIot.device({
   keyPath: './certs/private.pem.key',
  certPath: './certs/certificate.pem.crt',
    caPath: './certs/root-CA.crt',
  clientId: 'raniredd-desktop',
    region: 'us-east-1'
});

device
  .on('connect', function() {
    device.subscribe('FIRE');
  });

io.on('connection', function (socket) {
  
  device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });
  
  socket.on('thruster', function (thrusterPayload) {
    console.log(thrusterPayload);
    device.publish('THRUSTERS', JSON.stringify(thrusterPayload));
  });
});


  
app.use(express.static(__dirname + '/ui'));  

server.listen(3000);

app.get('/', function (req, res) {
  console.log("public directory  : "+__dirname);
  res.sendfile(__dirname + '/index.html');
});



