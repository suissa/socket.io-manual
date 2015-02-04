// Namespaces
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/namespace.html');
});

var nsp1 = io.of('/meu-namespace');
nsp1.on('connection', function(socket){

  console.log('um usuario conectou');

  socket.on('disconnect', function(){
    console.log('usuario desconectou');
  });

  socket.on('chat message', function(msg){
    console.log('menssagem: ' + msg);
    io.emit('chat message', msg);
  });

})


var nsp = io.of('/meu-namespace');
nsp.on('connection', function(socket){
  console.log('alguém conectou')
});
// nsp.emit('chat message', 'oi para todos!');

http.listen(3000, function(){
  console.log('listening on *:3000');
});