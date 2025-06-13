const app = require('./app');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('online-users', Array.from(onlineUsers.keys()));
  });

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit('msg-receive', {
        from: data.from,
        message: data.message,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        break;
      }
    }
    io.emit('online-users', Array.from(onlineUsers.keys()));
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
