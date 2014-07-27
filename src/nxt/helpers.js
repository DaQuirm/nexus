window.nxt = window.nxt || {};

nxt.Attr = function(name, value) {
	var data = (typeof name === 'string')
		? { name: name, value: typeof value === 'undefined' ? '' : value }
		: { items: name };
	return new nxt.Command('Attr', 'render', data);
};

nxt.Class = function(name, set) {
	if (typeof set === 'undefined') {
		set = true;
	}
	return set
		? new nxt.Command('Class', 'add', { name: name })
		: new nxt.Command('Class', 'remove', { name: name });
};

nxt.Text = function(text) {
	if (typeof text === 'undefined') {
		return undefined;
	}
	return new nxt.Command('Node', 'render', {
		node: document.createTextNode(text),
		text: text
	});
};

nxt.Event = function(name, handler) {
	return new nxt.Command('Event', 'add', { name: name, handler: handler });
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
		var contentManager = new nxt.ContentManager({ container: node });
		nxt.ContentManager.prototype.render.apply(contentManager, content);
	}
	return new nxt.Command('Node', 'render', { node: node });
};

nxt.Binding = function(cell, conversion, mode) {
	var commandCell = new nx.Cell();
	cell.bind(commandCell, '->', conversion);
	return commandCell;
};

nxt.DelegatedEvent = function(name, handlers) {
	return new nxt.Command('DelegatedEvent', 'add', { name: name, handlers: handlers });
};

nxt.Collection = function () {
	var collection = arguments[0];
	var conversion = arguments[1];
	var events = [].slice.call(arguments, 2);
	var commandCell = new nx.Cell();
	collection.event.bind(commandCell, '->', function(command) {
		command.data.items = command.data.items.map(conversion);
	});
	return commandCell;
};
