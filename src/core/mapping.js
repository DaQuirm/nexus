window.nx = window.nx || {};

nx.Mapping = function(pattern) {
	this.pattern = pattern;
};

nx.Mapping.prototype.map = function(source, target) {
	if (typeof this.pattern !== 'undefined') {
		for (var item in this.pattern) {
			if (item === '_') {
				target[this.pattern[item]] = source;
			} else if (this.pattern[item] === '_') {
				return target = source[item];
			} else {
				target[this.pattern[item]] = source[item];
			}
		}
		return target;
	} else {
		return target = source;
	}
};

nx.Mapping.prototype.inverse = function() {
	var inversePattern = {};
	for (var item in this.pattern) {
		inversePattern[this.pattern[item]] = item;
	}
	return new nx.Mapping(inversePattern);
};
