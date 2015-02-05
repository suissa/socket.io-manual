// Namespaces
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/namespace.html');
});

var namespace = io
  .of('/namespace')
  .on('connection', function(socket) {
    socket.on('message', function(data) {
      socket.broadcast.send(data);
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});