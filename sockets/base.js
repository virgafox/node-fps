module.exports = function (io) {
	
	io.on('connection', function(socket){
		console.log('user connected - id: '+socket.id);
		socket.on('disconnect', function(){
			console.log('user disconnected - id: '+socket.id);
  		});
	});
	
}