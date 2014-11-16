/**
 * @author mrdoob / http://mrdoob.com/
 *
 * @author virgafox
 */

THREE.PointerLockControls = function ( camera, cameraHeight, obstaclesArray ) {

	var scope = this;
	
	var cameraHeight = cameraHeight || 10;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = cameraHeight;
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	//var isOnObject = false;
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
				if ( canJump === true ) velocity.y += 250;
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
	
	//INTEGRATION OF COLLISION DETECTION
	
	if (typeof obstaclesArray !== 'undefined') {
		this.collisionsEnabled = true;
	} else {
		this.collisionsEnabled = false;
	}
	
	//collision distances from camera position
	var collisionDistances = {
		front: 5,
		front_left: 3,
		left: 5,
		back_left: 3,
		back: 5,
		back_right: 3,
		right: 5,
		front_right: 3,
		up: 1,
		down: cameraHeight
	};
	
	
	
	//max step height (excluded)
	var stepHeight = 2.5;
	
	var verticalCollisionsShift = ( cameraHeight - stepHeight ) / 2;
	
	var collisionsRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 0 );
	
	var getWalkingDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( 0, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();
	
	var collisions = {
		front: false,
		front_left: false,
		left: false,
		back_left: false,
		back: false,
		back_right: false,
		right: false,
		front_right: false,
		up: false,
		down: false
	};
	
	var computeCollisionDirection = {
		front: function() { return getWalkingDirection(new THREE.Vector3(0,0,0)).applyEuler(new THREE.Euler(0,0,0)); },
		front_left: function() { return getWalkingDirection(new THREE.Vector3(0,0,0)).applyEuler(new THREE.Euler(0,Math.PI*1/4,0)); },
		left: function() { return getWalkingDirection(new THREE.Vector3(0,0,0)).applyEuler(new THREE.Euler(0,Math.PI*2/4,0)); },
		back_left: function() { return getWalkingDirection(new THREE.Vector3(0,0,0)).applyEuler(new THREE.Euler(0,Math.PI*3/4,0)); },
		back: function() { return getWalkingDirection(new THREE.Vector3(0,0,0)).applyEuler(new THREE.Euler(0,Math.PI,0)); },
		back_right: function() { return getWalkingDirection(new THREE.Vector3(0,0,0)).applyEuler(new THREE.Euler(0,-Math.PI*3/4,0)); },
		right: function() { return getWalkingDirection(new THREE.Vector3(0,0,0)).applyEuler(new THREE.Euler(0,-Math.PI*2/4,0)); },
		front_right: function() { return getWalkingDirection(new THREE.Vector3(0,0,0)).applyEuler(new THREE.Euler(0,-Math.PI*1/4,0)); },
		up: function() { return new THREE.Vector3(0,1,0); },
		down: function() { return new THREE.Vector3(0,-1,0); }
	};

	var checkCollision = function(direction) {
		collisionsRaycaster.ray.origin.copy( yawObject.position );
		collisionsRaycaster.ray.direction.copy( computeCollisionDirection[direction]() );
		collisionsRaycaster.near = 0;
		collisionsRaycaster.far = collisionDistances[direction];
		
		var intersections = collisionsRaycaster.intersectObjects( obstaclesArray );
		var collision = (intersections.length > 0);
		
		if (direction !== 'up' && direction !== 'down') {
			for (var i = 2; i <= 3; i++) {
				collisionsRaycaster.ray.origin.y -= verticalCollisionsShift;
				intersections = collisionsRaycaster.intersectObjects( obstaclesArray );
				collision = collision || (intersections.length > 0);
			}
		}
		
		return collision;
	};
	
	//END INTEGRATION OF COLLISION DETECTION

	this.update = function () {

		if ( scope.enabled === false ) return;

		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		velocity.y -= 9.8 * 80.0 * delta; // 100.0 = mass

		if ( moveForward ) velocity.z -= 400.0 * delta;
		if ( moveBackward ) velocity.z += 400.0 * delta;

		if ( moveLeft ) velocity.x -= 400.0 * delta;
		if ( moveRight ) velocity.x += 400.0 * delta;
		
		//START ADDITION FOR NodeFPS
		
		//block movement on key up for more precision and less network flooding.
		if (!moveForward && !moveBackward) velocity.z = 0;
		if (!moveLeft && !moveRight) velocity.x = 0;
		
		//END ADDITION FOR NodeFPS
		
		//INTEGRATION OF COLLISION DETECTION
		
		if (this.collisionsEnabled) {
			
			for(direction in collisions) {
				collisions[direction] = checkCollision(direction);
			}
			
			if (collisions.front || collisions.front_left || collisions.front_right) velocity.z = Math.max( 0, velocity.z );
			
			if (collisions.left || collisions.front_left || collisions.back_left) velocity.x = Math.max( 0, velocity.x );
			
			if (collisions.back || collisions.back_left || collisions.back_right) velocity.z = Math.min( 0, velocity.z );
			
			if (collisions.right || collisions.front_right || collisions.back_right) velocity.x = Math.min( 0, velocity.x );
			
			if (collisions.up) velocity.y = Math.min( 0, velocity.y );	
			if (collisions.down) { 
				velocity.y = Math.max( 0, velocity.y ); 
				canJump = true;
				while(checkCollision('down')) {
					yawObject.position.y += 0.001;
				}
				yawObject.position.y -= 0.001;
			}
					
		}

		//END INTEGRATION OF COLLISION DETECTION

		yawObject.translateX( velocity.x * delta );
		yawObject.translateY( velocity.y * delta ); 
		yawObject.translateZ( velocity.z * delta );

		
		if ( yawObject.position.y < cameraHeight ) {

			velocity.y = 0;
			yawObject.position.y = cameraHeight;

			canJump = true;

		}
		
		
		// START ADDITION FOR NodeFPS
		// emit event on rototranslation change
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