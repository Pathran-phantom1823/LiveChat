$(document).ready(function () {

	const messageTypes = { LEFT: 'left', RIGHT: 'right', LOGIN: 'login' };

	//Chat stuff
	const chatWindow = $('#chat');
	const messagesList = $('#messagesList');
	const messageInput = $('#messageInput');
	const sendBtn = $('#sendBtn');
	const messageForm = $('#messageForm');
	//login stuff
	let username = '';
	const usernameInput = $('#usernameInput');
	const loginBtn = $('#loginBtn');
	const loginWindow = $('#login');


	const messages = []; // { author, date, content, type }

	//Connect to socket.io - automatically tries to connect on same port app was served from
	var socket = io();
	messageForm.addClass('hidden');
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
		chatWindow.scrollTop() = chatWindow.height();
	});

	createMessageHTML = function (message) {
		if (message.type === messageTypes.LOGIN) {
			return `
			<br><p class="secondary-text text-center mb-2" id="status" style="color:white">${
				message.author
				} joined the chat...</p>
		`;
		}
		else {

		}



		//I STOPPED RIGHT HERE
		return `
	<div class="messages ${
			message.type === messageTypes.LEFT ? 'you' : 'me'
			}">
		<div style="flex-direction: column;
		text-overflow: ellipsis;
		white-space: initial;
		word-wrap: break-word;
		overflow: hidden; padding: 10px;">
		<p style="font-weight: bold">${
			message.type === messageTypes.LEFT ? message.author : ''
			}</p>
     		${message.content} &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<br>
			 <p style="float: right">${message.date}</p>
  		</div>
	</div>
	`;
	};	

	displayMessages = function () {
		const messagesHTML = messages
			.map(message => createMessageHTML(message))
			.join('');
		messagesList.html(messagesHTML);
	};

	sendBtn.on("click", function (e) {
		e.preventDefault();
		if (!messageInput.val()) {
			console.log('Invalid input');
		}

		function formatAMPM(date) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'PM' : 'AM';
			var month = date.getMonth();
			var day = date.getDate();
			var year = date.getFullYear();
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes + ' ' + ampm + '  ' + month + '/' + day + '/' + year;
			return strTime;
		}

		const message = {
			author: username,
			date: formatAMPM(new Date()),
			content: messageInput.val()
		};
		sendMessage(message);
		//clear input
		messageInput.val("");
	});


	loginBtn.on("click", function (e) {
		e.preventDefault();

		if (!usernameInput.val()) {
			console.log('Must supply a username');
			return Swal.fire({
				type: 'error',
				title: 'Please input username!',
			})
		}

		//set the username and create logged in message
		username = usernameInput.val();
		sendMessage({ author: username, type: messageTypes.LOGIN });
		//ADDED NICKNAME
		socket.emit('send-nickname', username);

		loginWindow.addClass('hidden');
		chatWindow.removeClass('hidden');
		messageForm.removeClass('hidden');
		document.getElementById('pusher').classList.remove('hidden');
		// document.getElementById('messageForm').classList.remove('hidden');
	})



	$('#logoutBtn').click(function(){
		window.location.replace("index.html");
	})

	socket.on('allUsers', function (listOfUsers) {
		$('#noOfUsers').text(listOfUsers.length);
	});

	socket.on('allUsers', function (users) {
		$('#userList').html("<center>"+users.join(", ").replace(/,/g,"<br><hr>")+"</center>");
		// $('#messages').html();
	});

	sendMessage = function (message) {
		socket.emit('message', message);
	};

	$('#messageInput').bind("keypress", function () {
		socket.emit('typing');
	})

	socket.on('typing', function (message, err) {
		console.log(err);
		messagesList.append('<h6 id="isTyping" style="color: black; font-size: 20px;"></h6>');
		$('#typingalert').html(message.username + " is typing a message...");
		setTimeout(function () {
			$("#typingalert").html('');
		}, 3000);
	})


})