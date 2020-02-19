var app     = require('express')();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users      = {}; 
var usernames  = [];


io.on('connection', function(socket){

  // ketika ada pesan baru
    socket.broadcast.emit('newMessage', 'Seseorang tersambung ke chat');


  // ketika ada pesan baru
    socket.on('registerUser', function(username){
      if(usernames.indexOf(username) != -1){
        socket.emit('registerRespond', false);
      }else{
        users[socket.id]  = username;
        usernames.push(username);
        socket.emit('registerRespond', true);
        io.emit('addOnLineUsers', usernames); 
      }
    });

  // ketika ada pesan baru
    socket.on('newMessage', function(msg){
      io.emit('newMessage', msg);
      console.log('Chat baru: '+ msg)
    });

  // ketika user mengetik
    socket.on('newTyping', function(msg){
      io.emit('newTyping', msg);
      console.log(msg);
    });
  
  // ketika ada yg disconnect
    socket.on('disconnect', function(msg){
    socket.broadcast.emit('newMessage', 'Seseorang terputus dari chat');

    var index = usernames.indexOf(users[socket.id]);
    usernames.splice(index,1);
    delete users[socket.id];
    
    io.emit('addOnLineUsers', usernames); 

  });

});

http.listen(3000, function(){
  console.log('listening on 3000...');
});