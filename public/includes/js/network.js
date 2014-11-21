var socket = io();

socket.on('connect', function() {
	player.playerData.id = socket.io.engine.id;
	console.log('Hi '+player.playerData.nickname+', welcome to NodeFPS!' );
});


socket.on('gameInitialization', function(data) {
	var playersData = data.playersData;

	for (id in playersData) {
		var playerData = playersData[id];
		initPlayer(playerData);
		console.log(playerData.nickname+' is already in the game.');
	}

	socket.emit('playerInitialization', { playerData: player.playerData } );
});

socket.on('playerConnected', function(data) {
	var playerData = data.playerData;
	initPlayer(playerData);
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

socket.on('playerShooted', function(data) {
	var shooterId = data.shooterId;
	var shootedId = data.shootedId;
	var type = data.type;
	if (shootedId === player.playerData.id) {
		console.log('OUCH! you have been shooted to '+type+' by '+players[shooterId].playerData.nickname+'.');
	}
});

var initPlayer = function(playerData) {
	var newPlayer = new Player( { playerData: playerData } );
	players[playerData.id] = newPlayer;
	newPlayer.generateGraphics();
	obstacles.push(newPlayer.playerModel.body);
	obstacles.push(newPlayer.playerModel.head);
	scene.add(newPlayer.getObject3D());
}

eventManager.on('updateRototranslation', function() {
	socket.emit('updateRototranslation', { playerData: player.playerData } );
});

eventManager.on('shoot', function(data) {
	socket.emit('shoot', data);
});