module.exports = function (io) {
	
	var playersData = {};
	
	io.on('connection', function(socket) {
		
		console.log('new connection from id: '+socket.id);
		
		socket.emit('gameInitialization', { playersData: playersData } );
		
		socket.on('playerInitialization', function(data) {
			var playerData = data.playerData;
			playersData[socket.id] = playerData;
			console.log('player initialized - id: ' + playerData.id +', nickname: ' + playerData.nickname);
			socket.broadcast.emit('playerConnected', { playerData: playerData } );
		});

		socket.on('updateRototranslation', function(data) {
			var playerData = data.playerData;
			playersData[socket.id].rototranslation = playerData.rototranslation;
			socket.broadcast.emit('playerMoved', { playerData: playerData } );
		});
		
		socket.on('disconnect', function() {
			socket.broadcast.emit('playerDisconnected', { playerData: playersData[socket.id] } );
			console.log('player disconnected - id: ' + playersData[socket.id].id +', nickname: ' + playersData[socket.id].nickname);
			delete playersData[socket.id];
		});

	});
	
}