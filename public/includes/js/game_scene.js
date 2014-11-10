// scene content

// add axis helper
var axisHelper = new THREE.AxisHelper(1);
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
directionalLight.shadowCameraVisible = true;
scene.add( directionalLight );

// floor
var planeGeometry = new THREE.PlaneGeometry( 500, 500 );
planeGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xDDDDDD, side: THREE.DoubleSide } );
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;
scene.add( plane );

// objects

var boxGeometry = new THREE.BoxGeometry( 20, 20, 20 );
var boxMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
var box = new THREE.Mesh( boxGeometry, boxMaterial );
box.position.set( 0, 10, -50 );
box.castShadow = true;
box.receiveShadow = true;
scene.add( box );

var box2 = box.clone();
box2.position.set( 25, 10, -25 );
scene.add( box2 );

// player

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

player.pitch.add( gun );