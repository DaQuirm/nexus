window.nxt = window.nxt || {};

nxt.Command = function(type, method, data) {
    this.type = type;
    this.method = method;
    this.data = data;
};

nxt.Command.prototype.run = function() {
	var renderer = new nxt[this.type + 'Renderer'];
	return renderer[this.method].apply(
		renderer,
		[this.data].concat([].slice.apply(arguments))
	);
};
