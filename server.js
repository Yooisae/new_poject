const express = require('express');
const app = express();
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 3000 })

app.use("/", function(req, res){
	res.sendFile(__dirname + '/andex.ejs');
});

app.listen(3000);



socket.on('connection', (ws, req) => {
	ws.on('message', (msg) => {
		console.log('유저가 보낸거 : ' + msg)
	})
});