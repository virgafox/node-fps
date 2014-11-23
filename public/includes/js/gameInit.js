// game initialization

var stats0, stats1, rendererStats;
var scene, camera, renderer;
var controls;
var obstacles = [];
var targets = [];

var player = {};
var players = {};

var eventManager = new EventEmitter();

if ('pointerLockElement' in document || 
	'mozPointerLockElement' in document || 
	'webkitPointerLockElement' in document) { //the browser supports pointerlock
	
	// set modal text
	document.getElementById( 'modalText' ).innerHTML = 'Press Start to enable First Persion View. W-A-S-D for movement, space for jump.';
	
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
			document.addEventListener( 'mousedown', onMouseDown );
		} 
		else
		{
			controls.enabled = false;
			document.removeEventListener( 'mousedown', onMouseDown );
			$('#modalWindow').modal('show'); // show the modal
		}
	}
	
	var onMouseDown = function() {
		player.shoot(obstacles);
	}
	
	var pointerlockerror = function ( event ) {
		alert('pointerlock error');
	}

	// Hook pointer lock state change events
	document.addEventListener('pointerlockchange',pointerlockchange,false);
	document.addEventListener('mozpointerlockchange',pointerlockchange,false);
	document.addEventListener('webkitpointerlockchange',pointerlockchange,false);
	document.addEventListener('pointerlockerror',pointerlockerror,false);
	document.addEventListener('mozpointerlockerror',pointerlockerror,false);
	document.addEventListener('webkitpointerlockerror',pointerlockerror,false);

	// when click on the start button enable pointerlock
	document.getElementById('modalButton').addEventListener('click', function(event) {
		
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
					document.removeEventListener('fullscreenchange', fullscreenchange);
					document.removeEventListener('mozfullscreenchange', fullscreenchange);
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

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0xDDE8EC );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapEnabled = false;

	// fps stats
	stats0 = new Stats();
	stats0.setMode(0);
	stats0.domElement.style.position = 'absolute';
	stats0.domElement.style.right = '0px';
	stats0.domElement.style.bottom = '201px';
	document.body.appendChild( stats0.domElement );

	// ms stats
	stats1 = new Stats();
	stats1.setMode(1);
	stats1.domElement.style.position = 'absolute';
	stats1.domElement.style.right = '0px';
	stats1.domElement.style.bottom = '153px';
	document.body.appendChild( stats1.domElement );

	// webGLrenderer stats using THREEx library
	rendererStats = new THREEx.RendererStats();
	rendererStats.domElement.style.position = 'absolute';
	rendererStats.domElement.style.right = '0px';
	rendererStats.domElement.style.bottom = '0px';
	document.body.appendChild( rendererStats.domElement );

	var ratio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera( 45, ratio, 1, 1000 );

	scene = new THREE.Scene();

	controls = new THREE.PointerLockControls( camera, {
		collisionsEnabled: true,
		obstaclesArray: obstacles
	});
	player = new Player( { controls: controls } );
	scene.add( player.getObject3D() );

	// automatic window resizer using THREEx library
	var winResize = new THREEx.WindowResize(renderer, camera);
	
	document.body.appendChild( renderer.domElement );
}

function animate() {
	requestAnimationFrame( animate );
	
	stats0.update();
	stats1.update();
	rendererStats.update(renderer);
	
	controls.update();
	renderer.render( scene, camera );
}