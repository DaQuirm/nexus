window.nxt = window.nxt || {};

nxt.Command = function(type, method, data) {
    this.type = type;
    this.method = method;
    this.data = data;
};

nxt.Command.prototype.run = function() {
	var renderer = nxt[this.type + 'Renderer'];
	renderer[this.method].apply(
		renderer,
		[this.data].concat([].slice.apply(arguments))
	);
};
