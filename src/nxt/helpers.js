var nx = {
	Cell: require('../core/cell'),
	Collection: require('../core/collection'),
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
			cell.value = thirdArg ? thirdArg(event) : event;
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
		command = nx.Collection.mapCommand(command, conversion);
		return new nxt.Command('Content', command.method, command.data);
	};

	commandCell.reverseBind(collection.command, commandConverter);
	commandCell.value = commandConverter(
		new nx.Command('reset', { items: collection.items })
	);
	return commandCell;
};

nxt.ValueBinding = function (cell, conversion, backConversion) {
	var commandCell = new nxt.CommandCell();

	var binding = commandCell.reverseBind(cell, function (value) {
		return nxt.Attr('value', conversion ? conversion(value) : value);
	});

	var eventCommand = nxt.Event('input', function () {
		binding.lock();
		cell.value = backConversion ? backConversion(this.value) : this.value;
		binding.unlock();
	});

	return [eventCommand, commandCell];
};

nxt.Style = function (data) {
	return new nxt.Command('Style', 'render', data);
};

nxt.Fragment = function () {
	var args = [].slice.call(arguments);
	args = args.reduce(function (acc, item) {
		return acc.concat(item);
	}, []);
	var fragment = document.createDocumentFragment();
	if (args.length > 0) {
		nxt.ContentRenderer.render({ items: args }, { container: fragment });
	}
	return new nxt.Command('Fragment', 'render', { fragment: fragment });
};

nxt.If = function () {
	var args = [].slice.call(arguments);
	var condition = args[0];
	if (condition) {
		return nxt.Fragment.apply(null, args.slice(1));
	}
};

module.exports = {
	Attr:         nxt.Attr,
	Class:        nxt.Class,
	Text:         nxt.Text,
	Event:        nxt.Event,
	Element:      nxt.Element,
	Fragment:     nxt.Fragment,
	If:           nxt.If,
	Binding:      nxt.Binding,
	ItemEvent:    nxt.ItemEvent,
	Collection:   nxt.Collection,
	ValueBinding: nxt.ValueBinding,
	Style:        nxt.Style
};
