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
		console.log('you have been shooted to '+type+' by '+players[shooterId].playerData.nickname+'.');
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

eventManager.on('shoot', function() {
	var shootRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 0 );
	shootRaycaster.ray.origin.copy( controls.getObject().position );
	shootRaycaster.ray.direction.copy( controls.getDirection(new THREE.Vector3(0,0,0) ));
	shootRaycaster.near = 0;
	shootRaycaster.far = 100;
	var intersections = shootRaycaster.intersectObjects( obstacles );
	if (intersections.length > 0) {
		var target = intersections[0].object;
		if (target.userData.type !== undefined && (target.userData.type === 'body' || target.userData.type === 'head')) {
			console.log('hit! shooted: '+target.name);
			socket.emit('shoot', { type: target.userData.type, targetId: target.userData.ownerId });
		} else {
			console.log('miss! shooted: '+target.name);
		}
	}
});