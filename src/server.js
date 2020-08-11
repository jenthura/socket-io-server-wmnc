const app = require('./app');
const { PORT, NODE_ENV } = require('./config');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = {};

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.broadcast.emit('userconnect', 'new user connected');
  socket.on('username save', (username) => {
    console.log(socket.id);
    users[socket.id] = username;
    socket.emit('username saved', `${users[socket.id]} saved`);
  });
  socket.on('disconnect', () => {
    io.emit('disconnect', 'user disconnected');
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    if (socket.id in users) { //if they have a username
      socket.broadcast.emit('chat message', `${users[socket.id]}: ${msg}`);
    } else { //if they don't have a username
      users[socket.id] = socket.id;
      socket.broadcast.emit('chat message', `${users[socket.id]}: ${msg}`);
    }
    console.log('message: ' + msg);
  });
});

http.listen(PORT, () => {
  console.log(`Server is listening in ${NODE_ENV} mode at http://localhost:${PORT}`);
});