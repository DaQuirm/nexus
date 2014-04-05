window.nx = window.nx || {};
window.nx.Utils = window.nx.Utils || {};

nx.Utils.interpolateString = function(string, props) {
	var matches = string.match(/[^{\}]+(?=\})/g);
	matches.forEach(function(match) {
		string = string.replace('{'+match+'}', props[match]);
	});
	return string;
};
