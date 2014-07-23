window.nxt = window.nxt || {};

nxt.Command = function(type, method, data) {
    return {
        type: type,
        method: method,
        data: data
    };
};

nxt.Attr = function(name, value) {
	return (typeof name === 'string') ?
		{
			name: name,
			value: typeof value === 'undefined' ? '' : value,
			type: 'Attr'
		}
		: {
			items: name,
			type: 'Attr'
		};
};

nxt.Class = function(name, set) {
	return {
		name: name,
		set: set,
		type: 'Class'
	};
};

nxt.Text = function(text) {
	if (typeof text === 'undefined') {
		return undefined;
	}
	return {
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
	var args = [].slice.call(arguments);
	args = args.reduce(function(acc, item) {
		return acc.concat(item);
	}, []);
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

nxt.Binding = function(cell, conversion, mode) {
	return {
		cell: cell,
		conversion: conversion,
		mode: mode || '->',
		type: 'Binding',
		dynamic: true
	};
};

nxt.DelegatedEvent = function(name, handlers) {
	return {
		name: name,
		handlers: handlers,
		type: 'DelegatedEvent'
	};
};

nxt.Collection = function () {
	var collection = arguments[0];
	var conversion = arguments[1];
	var events = [].slice.call(arguments, 2);
	return {
		collection: collection,
		conversion: conversion,
		events: events,
		type: 'Collection',
		dynamic: true
	};
};
