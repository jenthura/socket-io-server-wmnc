const app = require('./app');
const { PORT, NODE_ENV } = require('./config');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = {};
let guestCount = 1;

io.on('connection', (socket) => {
  console.log('a user connected');
  users[socket.id]=`Guest#${guestCount}`;
  guestCount++;
  //emit usersList to other users
  io.emit('userlist update', users);
  socket.broadcast.emit('userconnect',`${users[socket.id]} connected`);

  socket.on('username save', (username) => {
    console.log(socket.id);
    users[socket.id]=username;
    //emit usersList with new username
    io.emit('userlist update', users);
  });
  socket.on('disconnect', () => {
    io.emit('disconnect', 'user disconnected');
    console.log('user disconnected');
    //delete user on disconnect
    delete users[socket.id];
    //emit usersList without deleted user
    socket.broadcast.emit('userlist update', users);
  });
  socket.on('typing', (isTyping) => {
    console.log(isTyping);
    io.emit('typing', isTyping);
  });

  socket.on('chat message', (msg) => {

    //on whisper
    if(msg[0] === '/'){
      const messageCommandString = msg.split(' ')[0];
      const messageUser = msg.split(' ')[1];
      const messageString = msg.slice(messageCommandString.length + messageUser.length + 2, msg.length);
      console.log('message string',  messageString);
      if(messageCommandString === '/whisper' ||messageCommandString === '/w'){
        if(Object.values(users).includes(messageUser)){
          const targetSocketId = Object.keys(users)[Object.values(users).indexOf(msg.split(' ')[1])];
          console.log('user exists', targetSocketId, messageString);
          io.to(targetSocketId).emit('whisper success', `Whisper from ${users[socket.id]}: ${messageString}`);
        } else{
          socket.emit('whisper failed', 'user does not exist');
        }  
      }      
    }else {
      io.emit('chat message',`${users[socket.id]}: ${msg}`);
    }
  });
});

http.listen(PORT, () => {
  console.log(`Server is listening in ${NODE_ENV} mode at http://localhost:${PORT}`);
});