var server = require('http').createServer();
var options = {
  cors: true
}

var io = require('socket.io')(server, options);

io.sockets.on('connection', function(socket) {
    console.log("Client has connected!");
});

console.log ('Server started.');
server.listen(3000);