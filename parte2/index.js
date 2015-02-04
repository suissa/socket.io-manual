// Rooms
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  socket.on('create', function(room) {
    // entra na sala
    socket.join(room);
    console.log('Criou sala: ', room);
    // emite um evento apenas para essa sala
    io.to(room).emit('create room', room);
    io.to(room).emit('chat message', 'GatinhaSafada17 entrou na sala ' + room);
    socket.on('chat message', function(msg){
      console.log('menssagem: ' + msg);
      io.to(room).emit('chat message', msg);
    });
  });

})




http.listen(3000, function(){
  console.log('listening on *:3000');
});