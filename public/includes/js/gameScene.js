// scene content

// add axis helper
var axisHelper = new THREE.AxisHelper(10);
scene.add(axisHelper);

// ambient lighting

var ambientLight = new THREE.AmbientLight( 0x555555 );
scene.add(ambientLight);


// light

var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
directionalLight.position.set( 300, 400, 500 );
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
var planeMaterial = new THREE.MeshLambertMaterial( { color: 0x222222, side: THREE.DoubleSide } );
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.name = 'Floor';
obstacles.push(plane);
plane.receiveShadow = true;
scene.add( plane );


// objects
function generateBox(name, width, height, depth) {
	var boxGeometry = new THREE.BoxGeometry( width, height, depth );
	var boxMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
	var box = new THREE.Mesh( boxGeometry, boxMaterial );
	box.castShadow = true;
	box.receiveShadow = true;
	box.name = name;
	obstacles.push(box);
	scene.add(box);
	return box;
}

var box1 = generateBox('box1', 20,20,20);
box1.position.set(60,10,-30);

var box2 = generateBox('box2', 20,10,20);
box2.position.set(20,5,-30);

var box3 = generateBox('box3', 20,5,20);
box3.position.set(-20,2.5,-30);

var box4 = generateBox('box4', 20,2,20);
box4.position.set(-60,1,-30);

var box5 = generateBox('box5', 20,10,20);
box5.position.set(-100,25,-30);

// player

player.generateGraphics();
