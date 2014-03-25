window.nxt = window.nxt || {};

nxt.Attr = function(name, value) {
	return (typeof name === 'string') ?
		{
			name: name,
			value: value,
			type: 'Attr'
		}
		: {
			items: name,
			type: 'Attr'
		};
};

nxt.Text = function(text) {
	return text && {
		text: text,
		node: document.createTextNode(text),
		type: 'Node'
	};
};

nxt.Event = function(name, handler) {
	return {
		name: name,
		handler: handler,
		type: 'Event'
	};
};

nxt.Element = function() {
	var args = Array.prototype.slice.call(arguments);
	var name = args[0];
	var node = document.createElement(name);
	if (args.length > 1) {
		var content = args.slice(1);
		var contentManager = new nxt.ContentManager(node);
		nxt.ContentManager.prototype.render.apply(contentManager, content);
	}
	return {
		name: name,
		node: node,
		type: 'Node'
	};
};

nxt.Binding = function(property, conversion, mode) {
	return {
		property: property,
		conversion: conversion,
		mode: mode || '->',
		type: 'Binding',
		dynamic: true
	};
};

nxt.Collection = function (collection, conversion) {
	return {
		collection: collection,
		conversion: conversion,
		type: 'Collection',
		dynamic: true
	};
};
