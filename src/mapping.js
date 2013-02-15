'use strict';

window.nx = window.nx || {};

nx.Mapping = function(pattern) {
	this.pattern = pattern;
};

nx.Mapping.prototype.map = function(from, to) {
	if (typeof this.pattern !== 'undefined') {
		for (var item in this.pattern) {
			if (item === '_') {
				return to[this.pattern[item]] = from;
			} else if (this.pattern[item] === '_') {
				return to = from[this.pattern[item]];
			} else {
				to[this.pattern[item]] = from[item];
			}
		}
		return to;
	} else {
		return to = from;
	}
};
