/* since utils comes first in the build, create namespaces here */
window.nx = {};
window.nxt = {};

window.nx.Utils = window.nx.Utils || {};

nx.Utils.interpolateString = function(string, props) {
	var matches = string.match(/[^{\}]+(?=\})/g);
	if (matches) {
		matches.forEach(function(match) {
			string = string.replace('{'+match+'}', props[match]);
		});
	}
	return string;
};

nx.Utils.mixin = function(target, source) {
	var keys = Object.getOwnPropertyNames(source);
	keys.forEach(function (key) {
		var desc = Object.getOwnPropertyDescriptor(source, key);
		Object.defineProperty(target, key, desc);
	});
};
