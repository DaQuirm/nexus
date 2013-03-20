window.nxt = window.nxt || {};

nxt.Attr = function(name, value) {
	return {
		name: name,
		value: value,
		type: 'Attr'
	};
};

nxt.Text = function(text) {
	return {
		text: text,
		node: document.createTextNode(text),
		type: 'Text'
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
	return {

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

