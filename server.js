const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let players = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    if (players.length < 2) {
        players.push(socket.id);
    }

    socket.on('chat message', (message) => {
        const sender = socket.id === players[0] ? 'User 1' : 'User 2';
        io.emit('chat message', { sender: sender, message: message });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        players = players.filter(id => id !== socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
