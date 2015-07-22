var nx = {};

nx.Command = function (method, data) {
	this.method = method;
	this.data = data;
};

nx.Command.prototype.apply = function () {
	var target = arguments[0];
	return target[this.method].apply(
		target,
		[this.data].concat([].slice.call(arguments, 1))
	);
};

module.exports = nx.Command;
