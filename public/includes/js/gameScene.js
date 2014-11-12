// scene content

// add axis helper
var axisHelper = new THREE.AxisHelper(10);
scene.add(axisHelper);

// ambient lighting

var ambientLight = new THREE.AmbientLight( 0x555555 );
scene.add(ambientLight);


// light

var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
directionalLight.position.set( 400, 500, 500 );
directionalLight.castShadow = true;
directionalLight.shadowCameraNear = 0;
directionalLight.shadowCameraFar = 1000;
directionalLight.shadowCameraLeft = -500;
directionalLight.shadowCameraRight = 500;
directionalLight.shadowCameraTop = 500;
directionalLight.shadowCameraBottom = -500;
directionalLight.intensity = 1;
directionalLight.shadowMapHeight = 1024;
directionalLight.shadowMapWidth = 1024;
//directionalLight.shadowCameraVisible = true;
scene.add( directionalLight );


// floor
var planeGeometry = new THREE.PlaneGeometry( 500, 500 );
planeGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xDDDDDD, side: THREE.DoubleSide } );
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.name = 'Floor';
plane.receiveShadow = true;
scene.add( plane );


// objects
function generateBox(width, height, depth) {
	var boxGeometry = new THREE.BoxGeometry( width, height, depth );
	var boxMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
	var box = new THREE.Mesh( boxGeometry, boxMaterial );
	box.castShadow = true;
	box.receiveShadow = true;
	return box;
}

var box1 = generateBox(20,10,20);
box1.name = 'box1';
box1.position.set(20,5,-30);
scene.add( box1 );

// player

function generatePlayerGraphics(player) {
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
	
	player.playerModel.pitchObject.add(gun);
	
	var headGeometry = new THREE.BoxGeometry(2,2,2);
	var headMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
	var head = new THREE.Mesh(headGeometry, headMaterial);
	head.castShadow = true;
	head.receiveShadow = true;
	player.playerModel.pitchObject.add(head);
	
	var bodyGeometry = new THREE.BoxGeometry(5,9,1);
	var bodyMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
	var body = new THREE.Mesh(bodyGeometry, bodyMaterial);
	body.position.set( 0, -5.5, 0 );
	body.castShadow = true;
	body.receiveShadow = true;
	player.playerModel.yawObject.add(body);
}

generatePlayerGraphics(player);
