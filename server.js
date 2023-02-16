const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});

const io = socket(server);

const messages = [];
const users = [];

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('message', (message) => { 
    messages.push(message);
    socket.broadcast.emit('message', message);
   });
  
   socket.on('join', (userName) => {
    users.push({ id: socket.id, name: userName });
    socket.broadcast.emit('message', {author: 'Chatbot', content: `<li><em>${userName} has joined the chat!`});
  });
  
  socket.on('disconnect', () => { 
    if(users.length > 0){
      disconnectedUser = users.find(user => user.id === socket.id).name;
      disconnectedUserIndex = users.findIndex(user => user.id === socket.id);
      users.splice(disconnectedUserIndex, 1);
      socket.broadcast.emit('message', {author: 'Chatbot', content: `<li><em>${disconnectedUser} has left the chat...`});
    }
  });
});



app.use(express.static(path.join(__dirname, '/client/')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname), '/client/index.html');
});
