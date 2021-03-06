var socket = io();

socket.on('connect', function() {
	player.playerData.id = socket.io.engine.id;
	console.log('Hi '+player.playerData.nickname+', welcome to NodeFPS!' );
});

socket.on('gameInitialization', function(data) {
	var playersData = data.playersData;

	for (var id in playersData) {
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
	var impactPoint = new THREE.Vector3(data.impactPoint.x, data.impactPoint.y, data.impactPoint.z);
	if (typeof data.shootedDetails === 'undefined') { // miss
		console.log(players[shooterId].playerData.nickname+' shooted to nobody.');
	} else { // hit
		var shootedId = data.shootedDetails.id;
		var playerPart = data.shootedDetails.part;
			if (shootedId === player.playerData.id) { // you are the target
				// TODO: update your health
				console.log('OUCH! you have been shooted to '+playerPart+' by '+players[shooterId].playerData.nickname+'.');
			} else { // someone else is the target
				// TODO: update player health
				console.log(players[shootedId].playerData.nickname+' has been shooted to '+playerPart+' by '+players[shooterId].playerData.nickname+'.');
			}
	}
	var shootOrigin = players[shooterId].playerModel.yawObject.position.clone();
	shootOrigin.y -= 1;
	shootingAnimation(shootOrigin, impactPoint, shootOrigin.distanceTo(impactPoint));
});

var initPlayer = function(playerData) {
	var newPlayer = new Player( { playerData: playerData } );
	players[playerData.id] = newPlayer;
	newPlayer.generateGraphics();
	obstacles.push(newPlayer.playerModel.body);
	obstacles.push(newPlayer.playerModel.head);
	scene.add(newPlayer.getObject3D());
};

eventManager.on('updateRototranslation', function() {
	socket.emit('updateRototranslation', { playerData: player.playerData } );
});

eventManager.on('shoot', function(data) {
	socket.emit('shoot', data);
});
