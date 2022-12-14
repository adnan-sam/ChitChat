var express = require('express');
var http = require('http');
const PORT = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);
var path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

var name;
app.post('/form-submit',(req,res) =>{
  // console.log(req.body.guestname);
  res.sendFile(__dirname + '/public/chatroom.html');
})

io.on('connection', (socket) => {
  console.log('new user connected');
  
  socket.on('joining msg', (username) => {
  	name = username;
  	io.emit('chat message', `--- ${name} joined the chat ---`);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('chat message', `--- ${name} left the chat ---`);
    
  });
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);         //sending message to all except the sender
  });
});

server.listen(PORT, () => {
  console.log('Server listening on :3000');
});