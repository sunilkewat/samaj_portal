require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO Server with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
});

// Socket Namespaces
const chatNamespace = io.of('/chat');
chatNamespace.on('connection', (socket) => {
  console.log(`[Socket.IO /chat] Client connected: ${socket.id}`);

  socket.on('join_group', ({ groupId }) => {
    socket.join(`group_${groupId}`);
    console.log(`Socket ${socket.id} joined group: ${groupId}`);
  });

  socket.on('leave_group', ({ groupId }) => {
    socket.leave(`group_${groupId}`);
  });

  socket.on('send_message', (payload) => {
    chatNamespace.to(`group_${payload.groupId}`).emit('new_message', payload);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO /chat] Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Samaj Portal Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Port: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});
