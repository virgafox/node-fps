/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;
	
	//INTEGRATION OF COLLISION DETECTION
	var collisionDirections = {
		front: {
			rotation: new THREE.Euler(0,0,0),
			distance: 5
		},
		back: {
			rotation: new THREE.Euler(0,Math.PI,0),
			distance: 5
		},
		left: {
			rotation: new THREE.Euler(0,Math.PI/2,0),
			distance: 5
		},
		right: {
			rotation: new THREE.Euler(0,-Math.PI/2,0),
			distance: 5
		},
		up: {
			rotation: new THREE.Euler(Math.PI/2,0,0),
			distance: 1		
		},
		down: {
			rotation: new THREE.Euler(-Math.PI/2,0,0),
			distance: 10		
		}
	}
	
	var checkCollision = function(raycaster, directionData, obstacles) {
		
	}
	
	var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
	//END

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var isOnObject = false;
	var canJump = false;

	var prevTime = performance.now();

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();
	
	// START ADDITION FOR NodeFPS
	var lastRototranslationUpdate = performance.now();
	var lastRototranslation = {
		position: yawObject.position.clone(),
		rotation: new THREE.Vector3(pitchObject.rotation.x, yawObject.rotation.y, 0)
	}
	// END ADDITION FOR NodeFPS

	this.update = function () {

		if ( scope.enabled === false ) return;
		
		//INTEGRATION OF COLLISION DETECTION
		
		this.isOnObject( false );
		
		raycaster.ray.origin.copy( this.getObject().position );
		var intersections = raycaster.intersectObjects( obstacles );
	
		if ( intersections.length > 0 ) {
			this.isOnObject( true );
		}
		//END

		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		if ( moveForward ) velocity.z -= 400.0 * delta;
		if ( moveBackward ) velocity.z += 400.0 * delta;

		if ( moveLeft ) velocity.x -= 400.0 * delta;
		if ( moveRight ) velocity.x += 400.0 * delta;
		
		//START ADDITION FOR NodeFPS
		
		//block movement on key up for more precision and less network flooding.
		if (!moveForward && !moveBackward) velocity.z = 0;
		if (!moveLeft && !moveRight) velocity.x = 0;
		
		//END ADDITION FOR NodeFPS

		if ( isOnObject === true ) {

			velocity.y = Math.max( 0, velocity.y );

		}

		yawObject.translateX( velocity.x * delta );
		yawObject.translateY( velocity.y * delta ); 
		yawObject.translateZ( velocity.z * delta );

		if ( yawObject.position.y < 10 ) {

			velocity.y = 0;
			yawObject.position.y = 10;

			canJump = true;

		}
		
		// START ADDITION FOR NodeFPS
		if( time - lastRototranslationUpdate > 1000/25 )	{
			lastRototranslationUpdate = time;
			var newPosition = yawObject.position.clone();
			var newRotation = new THREE.Vector3(pitchObject.rotation.x, yawObject.rotation.y, 0);
			if (!lastRototranslation.position.equals(newPosition) ||
				!lastRototranslation.rotation.equals(newRotation)) {
				
				//console.log('updateRototranslation event fired');
				
				player.playerData.rototranslation.position = newPosition;
				player.playerData.rototranslation.rotation = newRotation;
				lastRototranslation.position = newPosition;
				lastRototranslation.rotation = newRotation;
				eventManager.emit('updateRototranslation');
			}
		}
		// END ADDITION FOR NodeFPS

		prevTime = time;

	};

};