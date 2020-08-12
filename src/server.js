const app = require ('./app');
const {PORT, NODE_ENV} = require('./config');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// const helper = require('helper.js')

let users = {};

io.on('connection', (socket) => {
  console.log('a user connected');
  users[socket.id]=socket.id;
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
    io.emit('disconnect','user disconnected');
    console.log('user disconnected');
    //delete user on disconnect
    delete users[socket.id];
    //emit usersList without deleted user
    socket.broadcast.emit('userlist update', users)
  });
  socket.on('chat message', (msg) => {
    if(socket.id in users){
      io.emit('chat message',`${users[socket.id]}: ${msg}`);
    }else{
      io.emit('chat message',`${users[socket.id]}: ${msg}`);
    }
    console.log('message: ' + msg);
  });
});

http.listen(PORT, () => {
  console.log(`Server is listening in ${NODE_ENV} mode at http://localhost:${PORT}`);
});