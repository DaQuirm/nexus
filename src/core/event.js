var nx = {};

nx.Event = function () {
	this.handlers = {};
	this._nameIndex = 0;
};

nx.Event.prototype.trigger = function () {
	for (var name in this.handlers) {
		this.handlers[name].apply(null, arguments);
	}
};

nx.Event.prototype.add = function (handler, name) {
	name = name || this._nameIndex++;
	this.handlers[name] = handler;
	return name;
};

nx.Event.prototype.remove = function (name) {
	delete this.handlers[name];
};

module.exports = nx.Event;
