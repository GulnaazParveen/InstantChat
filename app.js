// const http = require("http")
// const express = require("express");
// const app = express();
// const PORT = process.env.PORT || 4000;
// const path = require('path')
// const server = http.createServer(app)
// const { Server } = require("socket.io");
// const { log } = require("console");


// // serve static folder 
// app.use(express.static(path.join(__dirname, 'public')))
// const io = new Server(server);

// let socketConnect = new Set()
// io.on("connection", onConnected)

// function onConnected(socket) {
//     console.log(socket.id);
//     socketConnect.add(socket.id)

//     io.emit('clients-total', socketConnect.size)

//     socket.on('disconnect', () => {
//         console.log('Socket disconnected', socket.id);
//         socketConnect.delete(socket.id)
//         io.emit('clients-total', socketConnect.size)

//     })
//     socket.on('message',(data)=>{
//         console.log(data);
//         socket.broadcast.emit('chat-message',data)
//     })
// }
// server.listen(PORT, () => {
//     console.log(`💬server on port ${PORT}`);
// })


const http = require("http");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const io = new Server(server);
let socketConnections = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
    console.log('Socket connected:', socket.id);
    socketConnections.add(socket.id);
    io.emit('clients-total', socketConnections.size);

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
        socketConnections.delete(socket.id);
        io.emit('clients-total', socketConnections.size);
    });

    socket.on('message', (data) => {
        // console.log(data);
        socket.broadcast.emit('chat-message', data);
    });
    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data)
    })
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
