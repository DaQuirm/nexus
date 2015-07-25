var nx = {
	Cell: require('../core/cell'),
	Command: require('../core/command')
};

var renderers = require('./renderers');

var nxt = {
	Command: require('./command'),
	CommandCell: require('./command-cell'),
	ContentRenderer: renderers('ContentRenderer')
};

nxt.Attr = function (name, value) {
	var data = (typeof name === 'string')
		? { name: name, value: typeof value === 'undefined' ? '' : value }
		: { items: name };
	return new nxt.Command('Attr', 'render', data);
};

nxt.Class = function (name) {
	return new nxt.Command('Class', 'render', { name: name });
};

nxt.Text = function (text) {
	if (typeof text === 'undefined') {
		return undefined;
	}
	return new nxt.Command('Node', 'render', {
		node: document.createTextNode(text),
		text: text
	});
};

nxt.Event = function (name, secondArg, thirdArg) {
	var handler = secondArg;
	if (secondArg instanceof nx.Cell) {
		var cell = secondArg;
		handler = function (event) {
			cell.value = thirdArg(event);
		};
	}
	return new nxt.Command('Event', 'add', { name: name, handler: handler });
};

nxt.Element = function () {
	var args = [].slice.call(arguments);
	args = args.reduce(function (acc, item) {
		return acc.concat(item);
	}, []);
	var name = args[0];
	var node = document.createElement(name);
	if (args.length > 1) {
		var content = args.slice(1);
		nxt.ContentRenderer.render({ items: content }, { container: node });
	}
	return new nxt.Command('Node', 'render', { node: node });
};

nxt.Binding = function (cell, conversion) {
	var commandCell = new nxt.CommandCell();
	commandCell.reverseBind(cell, conversion);
	return commandCell;
};

nxt.ItemEvent = function (name, handlers) {
	return { name: name, handlers: handlers };
};

nxt.Collection = function () {
	var collection = arguments[0];
	var conversion = arguments[1];
	var commandCell = new nxt.CommandCell({ cleanup: false });

	var commandConverter = function (command) {
		var data = {};
		for (var key in command.data) {
			if (key !== 'items') {
				data[key] = command.data[key];
			} else {
				data.items = command.data.items.map(conversion);
			}
		}
		return new nxt.Command('Content', command.method, data);
	};

	commandCell.reverseBind(collection.command, commandConverter);
	commandCell.value = commandConverter(
		new nx.Command('reset', { items: collection.items })
	);
	return commandCell;
};

nxt.ValueBinding = function (cell, conversion, backConversion) {
	var lock = { locked: false };
	var eventCommand = nxt.Event('input', function () {
		lock.locked = true;
		cell.value = backConversion ? backConversion(this.value) : this.value;
	});

	var commandCell = new nxt.CommandCell();
	var binding = commandCell.reverseBind(cell, function (value) {
		lock.locked = false; // for continuous binding sync, prevents alternate locking
		return nxt.Attr('value', conversion ? conversion(value) : value);
	});
	binding.lock = lock;

	return [eventCommand, commandCell];
};

nxt.Style = function (data) {
	return new nxt.Command('Style', 'render', data);
};

module.exports = {
	Attr:         nxt.Attr,
	Class:        nxt.Class,
	Text:         nxt.Text,
	Event:        nxt.Event,
	Element:      nxt.Element,
	Binding:      nxt.Binding,
	ItemEvent:    nxt.ItemEvent,
	Collection:   nxt.Collection,
	ValueBinding: nxt.ValueBinding,
	Style:        nxt.Style
};
