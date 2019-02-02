// var express = require('express'),
//      app = express()
//      server = require('http').createServer(app);
// var  io = require('socket.io').listen(server);



var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  path = require('path'),
  server = app.listen(port, function () {
    console.log('Server running on port ' + port)
  }),
  socket = require('socket.io'),
  io = socket.listen(server)




 let usernames = [];

// server.listen(process.env.PORT || 8903); // Use the port that Heroku provides or default to 5000


// let PORT = process.env.PORT || 3012;
// app.listen(PORT, () => {
//   console.log('App starting on port', PORT);
// });

// var express = require('express');
// app = express(),
//     server = require('http').createServer(app),
//     io = require('socket.io').listen(server);
//     usernames = [];

// server.listen(process.env.port || 8080);
// console.log('server on point!!!')

app.get('/', function (req, res) {
    // when you go to home streen slash load this file
    res.sendFile(__dirname + '/index.html')
})


io.sockets.on('connection', function (socket) {
    console.log('Socket connected ...');

    // dont want to have double usernames if one taken otherone cannot use that one
    socket.on('new user', function (data, callback) {
        // CHECK IF THE USERNAME IS THERE
        if (usernames.indexOf(data) != -1) {

            callback(false)
        } else {
            callback(true);
            socket.username = data;
            // ADD IT TO USERNAME
            usernames.push(socket.username);
            updateUsernames()
        }
    })

    // updatie usernames
    function updateUsernames() {
        // --- Passing the names so that the can be seen on sidebar
        io.sockets.emit('usernames', usernames)
    }

    // send message
    socket.on('send text', function (data) {
        io.sockets.emit('new message', {
            msg: data,
            user: socket.username
        });
    })
    // disconnect event!
    socket.on('disconnect', function (data) {
        // 
        if (!socket.username) {
            return;
        }
        // We want to take user out of usernames array then pass second param of 1
        usernames.splice(usernames.indexOf(socket.username), 1)
        updateUsernames();
    })
})