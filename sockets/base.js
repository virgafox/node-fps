module.exports = function (io) {
	
	var playersData = {};
	
	io.on('connection', function(socket) {
		
		console.log('player connected - id: '+socket.id); // log in server console
		
		socket.emit('gameInitialization', { playersData: playersData } );
		
		socket.on('playerInitialization', function(data) {
			var playerData = data.playerData;
			playersData[socket.id] = playerData;
			console.log('player initialized - id: ' + socket.id);
			socket.broadcast.emit('playerConnected', { playerData: playerData } );
		});

		socket.on('updateRototranslation', function(data) {
			var playerData = data.playerData;
			playersData[socket.id].rototranslation = playerData.rototranslation;
			socket.broadcast.emit('playerMoved', { playerData: playerData } );
		});
		
		socket.on('disconnect', function() {
			socket.broadcast.emit('playerDisconnected', { playerData: playersData[socket.id] } );
			delete playersData[socket.id];
			console.log('player disconnected - id: '+socket.id); // log server console
		});
		
	});
	
}