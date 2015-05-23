function EventEmitter () {
	this.handlers = {};
}

EventEmitter.prototype.on = function (event, handler) {
	var handlers_list = this.handlers[event];

	if (handlers_list === undefined) {
		handlers_list = this.handlers[event] = [];
	}

	handlers_list.push(handler);
};

EventEmitter.prototype.emit = function (event, data) {
	var handlers_list = this.handlers[event];

	if (handlers_list !== undefined) {
		handlers_list.forEach(function (handler) {
			handler(data);
		});
	}
};
