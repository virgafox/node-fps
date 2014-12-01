/*
	playerInput = {
		controls: Pointerlockcontrols yaw object,
		playerData: {
			id: string,
			nickname: string,
			rototranslation: {
				position: THREE.Vector3,
				rotation: THREE.Vector3
			{
		}
	}
*/

function Player(playerInput) {
	
	var controls = playerInput.controls;
	var playerData = playerInput.playerData;
	
	this.playerModel = {};
	
	if (typeof controls === 'undefined') {
		this.playerModel.yawObject = new THREE.Object3D();
		this.playerModel.yawObject.position.y = 10;
		this.playerModel.pitchObject = new THREE.Object3D();
		this.playerModel.yawObject.add(this.playerModel.pitchObject);
	} else {
		this.playerModel.yawObject = controls.getObject();
		this.playerModel.pitchObject = controls.getObject().children[0];
	}
	
	if (typeof playerData === 'undefined') {
		this.playerData = {};
		this.playerData.id = '';
		this.playerData.nickname = nickname;
		this.playerData.rototranslation = this.getRototranslation();
	} else {
		this.playerData = playerData;
	}
	
	this.setRototranslation(this.playerData.rototranslation);
	this.playerModel.yawObject.name = this.playerData.id;
}

Player.prototype.shoot = function(obstacles) {
	var shootOrigin = controls.getObject().position.clone();
	
	shootOrigin.y -= 1;
	
	var shootDirection = controls.getDirection(new THREE.Vector3(0,0,0)).clone();
	var shootRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 0 );
	shootRaycaster.ray.origin.copy( this.getObject3D().position );
	shootRaycaster.ray.direction.copy( controls.getDirection(new THREE.Vector3(0,0,0) ));
	shootRaycaster.near = 0;
	shootRaycaster.far = 100;
	var intersections = shootRaycaster.intersectObjects( obstacles );
	if (intersections.length > 0) {
		shootingAnimation(shootOrigin, intersections[0].point, intersections[0].distance);
		var target = intersections[0].object;
		if (target.userData.playerPart !== undefined) {
			if(target.userData.playerPart === 'body') {
				console.log('HIT! shooted to '+target.name);
			} else if (target.userData.playerPart === 'head') {
				console.log('HEADSHOT! shooted to '+target.name);
			}
			eventManager.emit('shoot', {
				impactPoint: intersections[0].point,
				shootedDetails: {
					id: target.userData.playerId,
					part: target.userData.playerPart
				}
			});
		} else {
			console.log('MISS! shooted to '+target.name);
			eventManager.emit('shoot', {
				impactPoint: intersections[0].point
			});
		}
	} else {
		shootingAnimation(shootOrigin, shootRaycaster.ray.at(100), 100);
		console.log('MISS! shooted to nothing');
		eventManager.emit('shoot', {
				impactPoint: shootRaycaster.ray.at(100)
		});
	}
}

Player.prototype.getObject3D = function() {
	return this.playerModel.yawObject;
}

Player.prototype.setRototranslation = function(rototranslation) {
	this.playerModel.yawObject.position.copy(rototranslation.position);
	this.playerModel.yawObject.rotation.y = rototranslation.rotation.y;
	this.playerModel.pitchObject.rotation.x = rototranslation.rotation.x;
}

Player.prototype.getRototranslation = function() {
	var rototranslation = {};
	rototranslation.position = this.playerModel.yawObject.position;
	rototranslation.rotation = new THREE.Vector3(
		this.playerModel.pitchObject.rotation.x, 
		this.playerModel.yawObject.rotation.y, 
		0
	);
	return rototranslation;
}

Player.prototype.generateGraphics = function() {
	
	//gun
	var gunGeometry = new THREE.BoxGeometry( 0.5, 0.5, 5 );
	var gunMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
	var gun = new THREE.Mesh( gunGeometry, gunMaterial );
	gun.position.set( 0.5, -1, -2.5 );
	gun.castShadow = true;
	gun.receiveShadow = true;
	
	var gunPointerGeometry = new THREE.BoxGeometry( 0.1, 0.2, 0.2 );
	var gunPointer = new THREE.Mesh( gunPointerGeometry, gunMaterial );
	gunPointer.position.set( 0, 0.35, -2.4 );
	gunPointer.castShadow = true;
	gunPointer.receiveShadow = true;
	gun.add(gunPointer);
	
	this.playerModel.pitchObject.add(gun);
			
	if (this !== player) { 
		//head
		var headGeometry = new THREE.BoxGeometry(2,2,2);
		var headMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
		var head = new THREE.Mesh(headGeometry, headMaterial);
		head.castShadow = true;
		head.receiveShadow = true;
		head.name = 'head of '+this.playerData.nickname;
		head.userData.playerPart = 'head';
		head.userData.playerId = this.playerData.id;
		this.playerModel.head = head;
		this.playerModel.pitchObject.add(head);
		
		//body
		var bodyGeometry = new THREE.BoxGeometry(5,9,1);
		var bodyMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
		var body = new THREE.Mesh(bodyGeometry, bodyMaterial);
		body.position.set( 0, -5.5, 0 );
		body.castShadow = true;
		body.receiveShadow = true;
		body.name = 'body of '+this.playerData.nickname;
		body.userData.playerPart = 'body';
		body.userData.playerId = this.playerData.id;
		this.playerModel.body = body;
		this.playerModel.yawObject.add(body);
		
		//sprite
		var canvasWidth = 200;
		var canvasHeight = 25;
		var dynTexture = new THREEx.DynamicTexture(canvasWidth,canvasHeight);
		dynTexture.drawText(
			this.playerData.nickname,
			undefined,
			canvasHeight/2,
			'black'
		);
	    var spriteMaterial = new THREE.SpriteMaterial({ 
		    map: dynTexture.texture, 
		    color: 0xffffff 
		});
	    var sprite = new THREE.Sprite( spriteMaterial );
	    sprite.scale.set(canvasWidth/canvasHeight,1,1);
	    sprite.position.y = 2;
	    this.playerModel.yawObject.add(sprite);
    }
}