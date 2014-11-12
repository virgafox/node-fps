/*
	playerInput = {
		controls: Pointerlockcontrols yaw object,
		playerData: {
			id: socket id,
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