![](http://faunaurbana.com.br/wp-content/uploads/2014/10/pedagios-paulistas-junho.jpg)

##O que é?


##Criando um chat

Criar um chat com socket.io é como se fosse um Hello World, além de ser altamente usado no mundo real, ainda é o primeiro exemplo que os desenvolvedores fazem, então mãos a obra.

###Criando servidor web
Primeiramente vamos criar uma aplicação express sem simples, para isso vamos criar seu package.json, você pode usar o comando `npm init` para isso e ele precisa ficar igual a esse:

```js
{
  "name": "socket-chat-exemplo",
  "version": "0.0.1",
  "description": "Meu primeiro app em socket.io",
  "dependencies": {}
}
```

Depois disso instalamos o socket.io com `--save` para ele ser inserido nas `dependencies` do `package.json`.

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

###Integrando o socket.io

Já criamos a nossa interface básica, agora precisamos instalar o socket.io o qual é dividido em 2 partes:

- Um servidor que se integra ao servidor HTTP do Node.js: socket.io
- Uma biblioteca que carregamos no navegador: socket.io-client

Para começarmos a integrar antes precisamos instalar ele localmente:

```
npm i --save socket.io
```

Depois vamos modificar o `index.js` e deixá-lo assim:

```js
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
var io = require('socket.io')(http);
```

Aqui estamos importando o socket.io passando para seu módulo nosso servidor HTTP.

```js
io.on('connection', function(socket){
  console.log('um usuario conectou');
});
```

E no código acima estamos usando a função `on` escutando o evento `connection`e recebendo o objeto `socket` via callback.

Depois disso precisamos integrar o socket.io no frontend, para isso vamos inserir o seguinte código no final, antes do `</body>`, do `index.html`:

```html

<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();
</script>
```

Na chamada `src="/socket.io/socket.io.js"` vai carregar o `socket.io-client` que expõe uma global, `io`.

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

Vamos emitir um evento quando o usuário escrever uma menssagem, o servidor receberá um evento chamado `chat message`, porém para fazermos nosso exemplo mais fácil utilizaremos o jQuery e enviamos os dados quando emitimos o evento.

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





