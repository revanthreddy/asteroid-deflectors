var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var awsIot = require('aws-iot-device-sdk');
var bodyParser = require('body-parser');

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
device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
});

io.on('connection', function (socket) {
  socket.on('thruster', function (thrusterPayload) {
  });
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


  
app.use(express.static(__dirname + '/ui'));  

server.listen(3000);

app.get('/', function (req, res) {
  console.log("public directory  : "+__dirname);
  res.sendfile(__dirname + '/index.html');
});


app.post("/thruster" , function(req,res){
    var thrusterPayload = req.body;
//     {
//     "type": "THRUSTER",
//     "id": "1",
//     "x": 1,
//     "y": 2,
//     "z": 3
// };
    console.log("-----PAYLOAD-----");
    console.log(thrusterPayload);
    device.publish('THRUSTERS', JSON.stringify(thrusterPayload));
    return res.send("ok");
});
