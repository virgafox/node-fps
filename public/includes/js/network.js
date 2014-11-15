var socket = io();

socket.on('connect', function() {
	player.playerData.id = socket.io.engine.id;
	console.log('Hi '+player.playerData.nickname+', welcome to NodeFPS!' );
});


socket.on('gameInitialization', function(data) {
	var playersData = data.playersData;

	for (id in playersData) {
		var newPlayer = new Player( { playerData: playersData[id] } );
		players[id] = newPlayer;
		newPlayer.generateGraphics();
		scene.add(newPlayer.getObject3D());
		console.log(newPlayer.playerData.nickname+' is already in the game.');
	}

	socket.emit('playerInitialization', { playerData: player.playerData } );
});

socket.on('playerConnected', function(data) {
	var playerData = data.playerData;
	var newPlayer = new Player( { playerData: playerData } );
	players[playerData.id] = newPlayer;
	newPlayer.generateGraphics();
	scene.add(newPlayer.getObject3D());
	console.log(playerData.nickname+' joined the game.');
});

socket.on('playerDisconnected', function(data) {
	var playerData = data.playerData;
	var oldPlayer = players[playerData.id];
	scene.remove(oldPlayer.getObject3D());
	delete players[playerData.id];
	console.log(playerData.nickname+' left the game.');
});

socket.on('playerMoved', function(data) {
	var playerData = data.playerData;
	players[playerData.id].setRototranslation(playerData.rototranslation);
});

eventManager.on('updateRototranslation', function() {
	socket.emit('updateRototranslation', { playerData: player.playerData } );
});