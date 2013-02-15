'use strict';

window.nx = window.nx || {};

nx.Event = function() {
	this.handlers = {};
	this._nameIndex = 0;
};

nx.Event.prototype.trigger = function(argument) {
	for (var name in this.handlers) {
		this.handlers[name](argument);
	}
};

nx.Event.prototype.add = function(handler, name) {
	name = name || this._nameIndex++;
	this.handlers[name] = handler;
};

nx.Event.prototype.remove = function(name) {
	delete this.handlers[name];
};