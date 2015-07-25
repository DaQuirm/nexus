var context = require.context('.', false, /renderer$/);

module.exports = function (name) {
	var renderers = {
		AttrRenderer:    './attr-renderer',
		ClassRenderer:   './class-renderer',
		ContentRenderer: './content-renderer',
		EventRenderer:   './event-renderer',
		NodeRenderer:    './node-renderer',
		StyleRenderer:   './style-renderer'
	};
	return context(renderers[name]);
};
