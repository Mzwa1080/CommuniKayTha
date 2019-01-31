var express = require('express');
server = express(),
    app = require('https').createServer(server),
    // server = createServer(server),
    // Attaching SOCKET.IO TO EXPRESS SERVER
    io = require('socket.io').listen(app);
    usernames = [];

// app.listen(process.env.port || 8219);
// console.log('server on point!!!')


let PORT = process.env.PORT || 8218;
app.listen(PORT, () => {
  console.log('App starting on port', PORT);
});


server.get('/', function (req, res) {
    // when you go to home streen slash load this file
    res.sendFile(__dirname + '/index.html')
})


io.sockets.on('connection', function(socket) {
    console.log('Socket connected ...');

// dont want to have double usernames if one taken otherone cannot use that one
    socket.on('new user', function(data, callback){
    // CHECK IF THE USERNAME IS THERE
        if(usernames.indexOf(data) != -1){
    
            callback(false)
        }
        else{
            callback(true);
            socket.username = data;
        // ADD IT TO USERNAME
            usernames.push(socket.username);
            updateUsernames()
        }
    })

    // updatie usernames
    function updateUsernames(){
// --- Passing the names so that the can be seen on sidebar
        io.sockets.emit('usernames', usernames)
    }

    // send message
    socket.on('send text', function(data) {
        io.sockets.emit('new message', {
            msg : data,
            user: socket.username
        });
    })
// disconnect event!
    socket.on('disconnect', function(data){
        // 
        if(!socket.username){
            return;
        }
// We want to take user out of usernames array then pass second param of 1
        usernames.splice(usernames.indexOf(socket.username), 1)
        updateUsernames();
    })
})