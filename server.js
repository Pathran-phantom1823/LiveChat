const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
var port = process.env.PORT || 3000;

var count = 0;
var clients = [];



// var username;


//Serve public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, +'public/index.html'));
});



io.on('connection', function (socket) {
	count++;
	console.log('a user connected');

	socket.on('intro', (data) => {
		clients.push(socket);
		socket.username = data;
		users = getUserList();
		console.log(users);
		io.emit("userList", users);
	})

	io.sockets.emit('count', { count: count })
	

	socket.on('message', function (message) {
		console.log('message: ' + message);
		//Broadcast the message to everyone
		io.emit('message', message);
	});

	socket.on('typing', function (message) {
		console.log({ username: io.sockets.author })
		socket.broadcast.emit('typing', { username: socket.username })
	})

	socket.on('disconnect', function () {
		console.log('user disconnected');
		count--;
		io.sockets.emit('count', { count: count })
	
	})
});


function getUserList() {
	var ret = [];
	for (var i = 0; i < clients.length; i++) {
		ret.push(clients[i].username);
	}
	return ret;
}

http.listen(port, function () {
	console.log('listening on port 3000');
});
