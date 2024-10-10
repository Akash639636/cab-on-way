
const socketInit = (io) => {
global.postCount = 0;
global.io = io;

    io.on('connection', (socket) => {
        console.log("User connected");

        socket.on('disconnect',  (socket)=> {
            console.log("user disconnected")
        })

    });
}

module.exports = {socketInit};