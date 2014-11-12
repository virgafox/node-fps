var socket = io();

socket.on('connect', function() {
	player.playerData.id = socket.io.engine.id;
	console.log('Your player ID is: '+socket.io.engine.id);
});


socket.on('gameInitialization', function(data) {
	var playersData = data.playersData;

	for (id in playersData) {
		var newPlayer = new Player( { playerData: playersData[id] } );
		players[id] = newPlayer;
		generatePlayerGraphics(newPlayer);
		scene.add(newPlayer.getObject3D());
		console.log('Initializing existing player with ID: '+newPlayer.playerData.id);
	}

	socket.emit('playerInitialization', { playerData: player.playerData } );
});

socket.on('playerConnected', function(data) {
	var playerData = data.playerData;
	var newPlayer = new Player( { playerData: playerData } );
	players[playerData.id] = newPlayer;
	generatePlayerGraphics(newPlayer);
	scene.add(newPlayer.getObject3D());
	console.log('Player joined game with ID: '+playerData.id);
});

socket.on('playerDisconnected', function(data) {
	var playerData = data.playerData;
	var oldPlayer = players[playerData.id];
	scene.remove(oldPlayer.getObject3D());
	delete players[playerData.id];
	console.log('Closed connection for player with id: '+playerData.id);
});

socket.on('playerMoved', function(data) {
	var playerData = data.playerData;
	players[playerData.id].setRototranslation(playerData.rototranslation);
});

eventManager.on('updateRototranslation', function() {
	socket.emit('updateRototranslation', { playerData: player.playerData } );
});