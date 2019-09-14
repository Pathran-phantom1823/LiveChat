const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
var port = process.env.PORT || 3000;

//Serve public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, +'public/index.html'));
});

io.on('connection', function (socket) {
	console.log('a user connected');

	socket.on('disconnect', function () {
		console.log('user disconnected');
	});

	socket.username = document.getElementById('usernameInput').value;

	socket.on('message', function (message) {
		console.log('message: ' + message);
		//Broadcast the message to everyone
		io.emit('message', message);
	});

	socket.on('typing', function(data){
		console.log({author:io.username})
		socket.broadcast.emit('typing', {username:socket.username})
	})
	
});






http.listen(port, function () {
	console.log('listening on port 3000');
});
