var nx = {
	Command: require('../core/command'),
	Utils: require('../core/utils')
};

var nxt = require('./renderers');

nxt.Command = function (type, method, data) {
	nx.Command.call(this, method, data);
	this.type = type;
};

nx.Utils.mixin(nxt.Command.prototype, nx.Command.prototype);
nxt.Command.prototype.constructor = nxt.Command;

nxt.Command.prototype.run = function () {
	this.renderer = nxt[this.type + 'Renderer'];
	return this.apply.apply(
		this,
		[this.renderer].concat([].slice.apply(arguments))
	);
};

module.exports = nxt.Command;
