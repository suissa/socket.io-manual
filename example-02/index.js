// Rooms
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('create', function(room) {
    socket.join(room);
    console.log('CRIOU ROOM: ', room);
    io.to(room).emit('create room', room);
    io.to(room).emit('chat message', 'Você entrou na sala: ' + room);
  });
})




http.listen(3000, function(){
  console.log('listening on *:3000');
});