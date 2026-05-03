const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const players = {};
const blocks = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send existing blocks to new player
  socket.emit('loadBlocks', blocks);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete players[socket.id];
    io.emit('playerDisconnected', socket.id);
  });

  socket.on('updatePosition', (data) => {
    players[socket.id] = data;
    socket.broadcast.emit('updatePlayerPosition', { id: socket.id, ...data });
  });

  socket.on('placeBlock', (data) => {
    blocks.push(data);
    socket.broadcast.emit('blockPlaced', data);
  });

  socket.on('deleteBlock', (data) => {
    const index = blocks.findIndex(b => b.x === data.x && b.y === data.y && b.z === data.z);
    if (index !== -1) {
      blocks.splice(index, 1);
      socket.broadcast.emit('deleteBlock', data);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});