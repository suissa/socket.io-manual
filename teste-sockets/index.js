// Rooms
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var connections = [];
io.on('connection', function(socket){
  // Evento de criação do socket
  socket.on('create', function(room) {
    // Entra na sala ou cria
    socket.join(room);
    console.log('CRIOU ROOM: ', room);
    // Emitimos o evento de criação da sala
    io.to(room).emit('create room', room);
    // Emitimos o evento de mensagem de chat
    io.to(room).emit('chat message', 'Você entrou na sala: ' + room);
  });
  socket.on('data', function(data) { console.log('Chegou dados: ', data); });
  connections.push(socket);
  // console.log(connections);

  socket.on('writing message', function(data) {
    console.log('Usuario esta diogitando uma mensagem');
  })
});




http.listen(3000, function(){
  console.log('listening on *:3000');
});