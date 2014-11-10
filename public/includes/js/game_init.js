// game initialization

var stats, rendererStats;
var scene, camera, renderer;
var controls;
var objects = [];
var raycaster;

var player = {};

if ('pointerLockElement' in document || 
	'mozPointerLockElement' in document || 
	'webkitPointerLockElement' in document) { // the browser supports pointerlock
	
	// set modal text
	document.getElementById( 'modalText' ).innerHTML = 'Press Start to enable First Persion View.';
	
	// add pointer (made in css)
	var pointer = document.createElement('div');
	pointer.id = 'pointer';
	document.body.appendChild(pointer);
	
	var element = document.body;

	// function called when entering (if) or exiting (else) pointerlock mode.
	var pointerlockchange = function ( event ) {

		if ( document.pointerLockElement === element || 
			 document.mozPointerLockElement === element || 
			 document.webkitPointerLockElement === element ) 
		{
			controls.enabled = true;
		} 
		else
		{
			controls.enabled = false;
			$('#modalWindow').modal('show');	// show the modal
		}
	}

	var pointerlockerror = function ( event ) {
		alert('pointerlock error');
	}

	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	// when click on the start button enable pointerlock
	document.getElementById('modalButton').addEventListener( 'click', function ( event ) {
		
		// hide modal
		$('#modalWindow').modal('hide');

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || 
									 element.mozRequestPointerLock || 
									 element.webkitRequestPointerLock;

		if ( /Firefox/i.test( navigator.userAgent ) ) {
			var fullscreenchange = function ( event ) {
				if ( document.fullscreenElement === element || 
					 document.mozFullscreenElement === element || 
					 document.mozFullScreenElement === element )
				{
					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
					element.requestPointerLock();
				}
			}
			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
			element.requestFullscreen = element.requestFullscreen || 
										element.mozRequestFullscreen || 
										element.mozRequestFullScreen || 
										element.webkitRequestFullscreen;
			element.requestFullscreen();
		} else {
			element.requestPointerLock();
		}
	}, false );
	
} else { // the browser does not support pointerlock
	// set modal text
	document.getElementById( 'modalText' ).innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API.';
	// disable button
	document.getElementById( 'modalButton' ).disabled = true;
}

// initialize modal, auto-show on initialization
$('#modalWindow').modal({
	backdrop: false,
	keyboard: false,
	show: true
});

init();
animate();

function init() {

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xDDE8EC );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapEnabled = true;

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

	scene = new THREE.Scene();

	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );
	
	player.pitch = camera.parent;
	player.yaw = controls.getObject();

	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

	// automatic window resizer using THREEx library
	var winResize = new THREEx.WindowResize(renderer, camera);
	
	document.body.appendChild( renderer.domElement );
}

function animate() {
	requestAnimationFrame( animate );

	controls.isOnObject( false );

	raycaster.ray.origin.copy( controls.getObject().position );
	raycaster.ray.origin.y -= 10;
	var intersections = raycaster.intersectObjects( objects );

	if ( intersections.length > 0 ) {
		controls.isOnObject( true );
	}

	controls.update();
	renderer.render( scene, camera );
}

function info() {
	var webGLRenderer = renderer;
	console.log("WebGL Renderer");
	console.log("== Memory =====");
	console.log("Programs: " + webGLRenderer.info.memory.programs);
	console.log("Geometries: " + webGLRenderer.info.memory.geometries);
	console.log("Textures: " + webGLRenderer.info.memory.textures);
	console.log("== Render =====");
	console.log("Calls: " + webGLRenderer.info.render.calls);
	console.log("Vertices: " + webGLRenderer.info.render.vertices);
	console.log("Faces: " + webGLRenderer.info.render.faces);
	console.log("Points: " + webGLRenderer.info.render.points);
}