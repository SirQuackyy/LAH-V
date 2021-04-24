var SIGNALING_SERVER = 'http://localhost:3000/';
 socket = io.connect(SIGNALING_SERVER);
 socket.on('connect', function () {
   socket.emit('join', {
     username: loggedInUser.username
   });
 });
 socket.send = function (message) {
   socket.emit('message', {
     fromUsername: peer.fromUsername,
     toUsername: peer.toUsername,
     data: message
   });
 };
 socket.on('disconnect', function () {
   socket.emit('disconnect', {
     username: loggedInUser.username
   });
 });

 socket.on('onlineUsers', function (onlineUsers) {
   $.each(onlineUsers, function (n, user) {
     if (user && user.username != loggedInUser.username && !(user.username == 'undefined' || user.username == '')) {
       chatObject.data.connections[user.username] = {
       onlineStatus: 'online'
       };
     }
  });
 });
 socket.on('disconnected', function (username) {
   chatObject.data.connections[username] = {
     onlineStatus: 'offline',
   };
 });
 
 socket.emit('userPresence', {
   username: username
 });