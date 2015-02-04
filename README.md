![](http://faunaurbana.com.br/wp-content/uploads/2014/10/pedagios-paulistas-junho.jpg)

##Criando um chat

Criar um chat com Socket.io é como se fosse um Hello World, além de ser altamente usado no mundo real, ainda é o primeiro exemplo que os desenvolvedores fazem, então mãos a obra.

###Criando servidor web
Primeiramente vamos criar uma aplicação express sem simples, para isso vamos criar seu package.json, você pode usar o comando `npm init` para isso e ele precisa ficar igual a esse:

```js
{
  "name": "socket-chat-exemplo",
  "version": "0.0.1",
  "description": "Meu primeiro app em Socket.io",
  "dependencies": {}
}
```

Depois disso instalamos o Socket.io com `--save` para ele ser inserido nas `dependencies` do `package.json`.

```
npm i --save express
```

Agora podemos criar o index.js contendo o Express para levantarmos um servidor http com gerenciamento de rotas, o `index.js` deverá ficar assim:

```js
var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, function(){
  console.log('servidor rodando em localhost:3000');
});
```


Depois disso você entra na URL `localhost:3000` e verá um belo e grande **Hello World**. Agora vamos criar um `index.html` que será servido pelo Express para nosso frontend.

```html
<!doctype html>
<html>
  <head>
    <title>Socket.IO chat</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font: 13px Helvetica, Arial; }
      form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
      form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
      form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages li { padding: 5px 10px; }
      #messages li:nth-child(odd) { background: #eee; }
    </style>
  </head>
  <body>
    <ul id="messages"></ul>
    <form action="">
      <input id="m" autocomplete="off" /><button>Send</button>
    </form>
  </body>
</html>
```


E precisamos mudar nossa rota no Express para ela servir esse arquivo.

```js
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
```

![Screenshot do index.html](https://cldup.com/DmTV-jmdaz-3000x3000.png)

###Integrando o Socket.io

Já criamos a nossa interface básica, agora precisamos instalar o Socket.io o qual é dividido em 2 partes:

- Um servidor que se integra ao servidor HTTP do Node.js: Socket.io
- Uma biblioteca que carregamos no navegador: Socket.io-client

Para começarmos a integrar antes precisamos instalar ele localmente:

```
npm i --save Socket.io
```

Depois vamos modificar o `index.js` e deixá-lo assim:

```js
var app = require('express')();
var http = require('http').Server(app);
var io = require('Socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('um usuario conectou');
});

http.listen(3000, function(){
  console.log('servidor rodando em localhost:3000');
});
```

Vamos analisar as modificações:

```js
var io = require('Socket.io')(http);
```

Aqui estamos importando o Socket.io passando para seu módulo nosso servidor HTTP.

```js
io.on('connection', function(socket){
  console.log('um usuario conectou');
});
```

E no código acima estamos usando a função `on` escutando o evento `connection`e recebendo o objeto `socket` via callback.

Depois disso precisamos integrar o Socket.io no frontend, para isso vamos inserir o seguinte código no final, antes do `</body>`, do `index.html`:

```html

<script src="/Socket.io/Socket.io.js"></script>
<script>
  var socket = io();
</script>
```

Na chamada `src="/Socket.io/Socket.io.js"` vai carregar o `Socket.io-client` que expõe uma global, `io`.

Na única linha do nosso script nós estamos


![](https://cldup.com/OcJ3ZUv38U-1200x1200.png)

Você pode abrir mais abas e ver elas conectadas.

![](https://cldup.com/79UNmKTVRt-1200x1200.png)

Cada socket também pode disparar o evento `disconnect` e para ouvirmos ele modificaremos nosso código para o seguinte:

```js
io.on('connection', function(socket){
  console.log('um usuario conectou');
  socket.on('disconnect', function(){
    console.log('usuario desconectou');
  });
});
```

Perceba que o `disconnect` não está no `io` que é nosso servidor e sim em **cada** socket que chega no nosso servidor, por isso a função `on` está sendo chamada no `socket`.

Agora você pode atualizar um aba várias vezes e terá o seguinte resultado:

![](https://cldup.com/_eJqTwAVyi-2000x2000.png)

###Emitindo eventos

A principal ideia por trás do Socket.io é que você possa enviar e receber qualquer evento e qualquer dado que você quiser. Você pode enviar qualquer objeto que possa ser convertido para JSON, dados binários também são suportados.

Vamos emitir um evento quando o usuário escrever uma mensagem, o servidor receberá um evento chamado `chat message`, porém para fazermos nosso exemplo mais fácil utilizaremos o jQuery e enviamos os dados quando emitimos o evento.

```
<script src="http://code.jquery.com/jquery-1.11.1.js"></script>
<script>
  var socket = io();
  $('form').submit(function(){
    var mensagem = $('#m').val();
    socket.emit('chat message', mensagem);
    $('#m').val('');
    return false;
  });
</script>
```

O envio da mensagem se dá nessa linha `socket.emit('chat message', $('#m').val());`. Fácil perceber que a função `emit` é a responsável por emitirmos um evento que será recebido via socket no nosso servidor.

Depois só precisamos ouvir esse evento no servidor.

```
socket.on('chat message', function(msg){
  console.log('message: ' + msg);
});
```

Agora vamo testar nosso chat se está enviando a mensagem e o servidor está recebendo.

![](https://cldup.com/jiMht0-GPF.thumb.png)

![](https://cldup.com/VkN6AJOB6f-1200x1200.png)

Agora vamos ouvir as mensagens do chat que veem do servidor para o cliente, para isso iremos usar a função `on` para escutar o evento `chat message`:

```js
<script>
  var socket = io();
  $('form').submit(function(){
    var mensagem = $('#m').val();
    socket.emit('chat message', mensagem);
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
</script>
```

Chamamos essa função fora do `submit` do jQuery já que precisamos que o socket esteja ouvindo mesmo antes do cliente enviar qualquer coisa.

Com isso já iniciamos um chat, mas para criarmos um chat com suas funcionalidades comuns com envio de mensagem direta ou em canais específicos precisaremos utilizar outros conceitos do Socket.io que iremos ver agora.

###Broadcasting
Nosso próximo objetivo é emitir um evento do servidor para o resto dos usuários. Se precisamos emitir um evento usaremos a mesma função que o nosso frontend, porém em vez de ser no `socket` será no `io` que é nosso servidor que gerencia os sockets.

```
io.emit('algum evento', { para: 'todos' });
```

Caso você queira emitir um eventos para todos menos para um `socket` pode usar `socket.broadcast.emit(evento)` como visto no código abaixo:

```
io.on('connection', function(socket){
  socket.broadcast.emit('hi');
});
```

Porém no nosso exemplo, apenas para continuar simples, iremos emitir o evento para todos, incluindo o emissor.

```
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
```


Depois disso precisamos mudar nosso `index.html` para receber esse evento do servidor.

```js
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});
```

Para testar abra mais abas e envie uma mensagem em uma delas clickando no botão send e depois confira nas outras abas.

![](https://cldup.com/tRsIM2kApm-3000x3000.png)

###Salas e Namespaces

Esse conceito é muito importante no Socket.io pois nos possibilita criar namespaces para os sockets, ou seja, criando diferentes endpoints.

Este é um recurso útil para minimizar o número de recursos (conexões TCP) e a facilidade de separação entre os canais de comunicação (sockets).

####Namespace Padrão

Chamamos o namespace padrão `/` e é ondes clientes do Socket.IO irão conectar por padrão, e aquele que o servidor escuta por padrão.

Este namespace é identificado por io.sockets ou simplesmente io:

```js
// os dois seguintes irão emitir a todos os sockets ligados ao`/`
io.sockets.emit('oi', 'para todos');
io.emit('oi', 'para todos'); // forma curta
```

Cada namespace emite um evento de conexão que recebe cada soclet como parâmetro.

```js
io.on('connection', function(socket){
  socket.on('disconnect', function(){ });
});
```

####Namespaces personalizados
Para configurar um espaço para nome personalizado, você pode ligar a função of no servidor:


```js
var nsp = io.of('/meu-namespace');
nsp.on('connection', function(socket){
  console.log('alguém conectou'):
});
nsp.emit('oi', 'para todos!');
```

No lado do cliente, você diz para o Socket.io conectar naquele namespace:

```js
var socket = io('/meu-namespace');
```


**Nota importante**: O namespace é um detalhe de implementação do protocolo Socket.IO, e não está relacionada com a URL real do transporte, cujo padrão é /socket.io/....

####Salas

Dentro de cada namespace, você também pode definir canais arbitrários que os sockets podem entrar e sair.

#####Entrando e saindo

Você pode entrar `join` para assinar o socket a um determinado canal:

```js
io.on('connection', function(socket){
  socket.join('minha sala');
});
```


```js
io.to('minha sala').emit('algum evento'):
```

Para deixar um canal você pode chamar `leave` da mesma forma que o `join`.

###Sala padrão
Cada Socket no Socket.io é identificado por um randômico e únido identificador `Socket.io#id`. Para nossa facilidade, cada socket automaticamente entra em uma sala identificada por esse id.

###Desconectando
Após a desconexão, sockets chamam `leave` em todos os canais que ele fazia parte automaticamente

Upon disconnection, sockets leave all the channels they were part of automatically, and no specially teardown is needed on your part.

###O envio de mensagens a partir do mundo exterior
Em alguns casos, você pode querer emitir eventos para sockets em Socket.IO de fora do contexto do seu processo do Socket.io.

Há várias maneiras de resolver este problema, como a implementação de seu próprio canal para enviar mensagens para o processo.

Para nossa sorte temos 2 módulos que facilitam isso:

- [socket.io-redis](http://github.com/automattic/socket.io-redis)
- [socket.io-emitter](http://github.com/automattic/socket.io-emitter)

Ao implementar o `Adapter` do Redis:

```js
var io = require('socket.io')(3000);
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));
```

Pode então emitir mensagens de qualquer outro processo de qualquer canal:

```js
var io = require('socket.io-emitter')();
setInterval(function(){
  io.emit('time', new Date);
}, 5000);
```





