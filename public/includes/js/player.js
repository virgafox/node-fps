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

Player.prototype.getObject3D = function() {
	return this.playerModel.yawObject;
}

Player.prototype.setRototranslation = function(rototranslation) {
	this.playerModel.yawObject.position = rototranslation.position;
	this.playerModel.yawObject.rotation.y = rototranslation.rotation.y;
	this.playerModel.pitchObject.rotation.x = rototranslation.rotation.x;
}

Player.prototype.getRototranslation = function() {
	var rototranslation = {};
	rototranslation.position = this.playerModel.yawObject.position;
	rototranslation.rotation = new THREE.Vector3(this.playerModel.pitchObject.rotation.x, this.playerModel.yawObject.rotation.y, 0);
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
	
	if (this !== player) { //for the actual player don't render the head, body and sprite.
		//head
		var headGeometry = new THREE.BoxGeometry(2,2,2);
		var headMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
		var head = new THREE.Mesh(headGeometry, headMaterial);
		head.castShadow = true;
		head.receiveShadow = true;
		this.playerModel.pitchObject.add(head);
		
		//body
		var bodyGeometry = new THREE.BoxGeometry(5,9,1);
		var bodyMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
		var body = new THREE.Mesh(bodyGeometry, bodyMaterial);
		body.position.set( 0, -5.5, 0 );
		body.castShadow = true;
		body.receiveShadow = true;
		this.playerModel.yawObject.add(body);
		
		//sprite
		var canvasWidth = 200;
		var canvasHeight = 25;
		var dynamicTexture  = new THREEx.DynamicTexture(canvasWidth,canvasHeight);
		dynamicTexture.drawText(this.playerData.nickname, undefined, canvasHeight/2, 'black');
	    var spriteMaterial = new THREE.SpriteMaterial( { map: dynamicTexture.texture, color: 0xffffff } );
	    var sprite = new THREE.Sprite( spriteMaterial );
	    sprite.scale.set(canvasWidth/canvasHeight,1,1);
	    sprite.position.y = 2;
	    this.playerModel.yawObject.add(sprite);
    }


}