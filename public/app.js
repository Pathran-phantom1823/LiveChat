const messageTypes = { LEFT: 'left', RIGHT: 'right', LOGIN: 'login', LOGOUT: 'logout' };

//Chat stuff
const chatWindow = document.getElementById('chat');
const messagesList = document.getElementById('messagesList');
var messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
var typeStatus = document.getElementById('typingalert');
// 	var usersWindow = document.getElementById('users');
var typingDelayMillis = 5000;
var userList = [];
var lastTypedTime = new Date(0);
var logoutBtn = document.getElementById('logoutBtn');


//login stuff
var username = '';
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const loginWindow = document.getElementById('login');
var inputM = document.getElementById('messageInput');
var alert = document.getElementById('typingalert');

const messages = []; // { author, date, content, type }

//Connect to socket.io - automatically tries to connect on same port app was served from
var socket = io();

socket.on('message', function (message) {
	//Update type of message based on username
	if (message.type !== messageTypes.LOGIN) {
		if (message.author === username) {
			message.type = messageTypes.RIGHT;
		} else {
			message.type = messageTypes.LEFT;
		}
	}

	messages.push(message);
	displayMessages();

	//scroll to the bottom
	chatWindow.scrollTop = chatWindow.scrollHeight;
});

createMessageHTML = function (message) {
	if (message.type === messageTypes.LOGIN) {
		return `
			<p class="secondary-text text-center mb-2">${
			message.author
			} joined the chat...</p>
		`;
	}else if (message.type === messageTypes.LOGOUT) {
		return `
			<p class="secondary-text text-center mb-2">${
			message.author
			} lEFT the chat...</p>
		`;
	}
	return `
	<div class="message ${
		message.type === messageTypes.LEFT ? 'message-left' : 'message-right'
		}">
		<div class="message-details flex">
			<p class="flex-grow-1 message-author">${
		message.type === messageTypes.LEFT ? message.author : 'You Sent..'
		}</p>
			<p class="message-date">${message.date}</p>
		</div>
		<p class="message-content">${message.content}</p>
	</div>
	`;
};

// clearMessage = function(message){
// 	if (message.type === messageTypes.LOGOUT) {
// 		return `
// 			<p class="secondary-text text-center mb-2">${
// 			message.author
// 			} lEFT the chat...</p>
// 		`;
// 	}
// }

logoutBtn.addEventListener('click', function(){
	loginWindow.classList.remove('hidden');
	chatWindow.classList.add('hidden');
	document.getElementById('count').classList.add('hidden');
	document.getElementById('messageForm').classList.add('hidden');
	document.getElementById('logoutBtn').style.display = 'none';


})



displayMessages = function () {
	const messagesHTML = messages
		.map(message => createMessageHTML(message))
		.join('');
	messagesList.innerHTML = messagesHTML;
};

	socket.on('count', function(data){
		document.getElementById('counter').innerHTML = data.count;
		console.log(data.count);
	});

inputM.addEventListener("keypress", function () {
	socket.emit('typing');
})

socket.on('typing', function (message) {
	username = usernameInput.value;
	alert.innerHTML = username + " Is typing..";
	setTimeout(function(){
		alert.innerHTML = "";
	},3000);
})





sendBtn.addEventListener('click', function (e) {
	e.preventDefault();
	if (!messageInput.value) {
		return console.log('Invalid input');
	}

	const date = new Date();
	const month = ('0' + date.getMonth()).slice(0, 2);
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const day = date.getDate();
	const year = date.getFullYear();
	const dateString = `${month}/${day}/${year}_${hours}:${minutes}`;

	const message = {
		author: username,
		date: dateString,
		content: messageInput.value
	};
	sendMessage(message);
	//clear input
	messageInput.value = '';
});


loginBtn.addEventListener('click', function (e) {
	e.preventDefault();
	if (!usernameInput.value) {
		return console.log('Must supply a username');
	}

	//set the username and create logged in message
	username = usernameInput.value;
	sendMessage({ author: username, type: messageTypes.LOGIN });

	//show chat window and hide login
	loginWindow.classList.add('hidden');
	chatWindow.classList.remove('hidden');
	document.getElementById('count').classList.remove('hidden');
	document.getElementById('messageForm').classList.remove('hidden');
	document.getElementById('logoutBtn').style.display = 'block';
	// usersWindow.classList.remove('hidden')
	
});

sendMessage = function (message) {
	socket.emit('message', message);
};

