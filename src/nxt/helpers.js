nxt.Attr = function(name, value) {
	var data = (typeof name === 'string')
		? { name: name, value: typeof value === 'undefined' ? '' : value }
		: { items: name };
	return new nxt.Command('Attr', 'render', data);
};

nxt.Class = function(name) {
	return new nxt.Command('Class', 'render', { name: name });
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
		nxt.ContentRenderer.render({ items: content }, { container: node });
	}
	return new nxt.Command('Node', 'render', { node: node });
};

nxt.Binding = function(cell, conversion) {
	var commandCell = new nxt.CommandCell();
	commandCell.reverseBind(cell, conversion);
	return commandCell;
};

nxt.ItemEvent = function(name, handlers) {
	return { name: name, handlers: handlers };
};

nxt.Collection = function () {
	var collection = arguments[0];
	var conversion = arguments[1];
	var events = [].slice.call(arguments, 2);
	var commandCell = new nxt.CommandCell({ cleanup: false });
	collection.event.value = new nxt.Command('Content', 'reset', { items: collection.items });
	commandCell.reverseBind(collection.event, function(command) {
		if (typeof command !== 'undefined') {
			command.data.items = command.data.items.map(conversion);
		}
		return command;
	});
	var delegatedEvents;
	if (events.length > 0) {
		delegatedEvents = events.map(function(event) {
			return nxt.Event(event.name, function(evt) {
				var target = evt.target;
				var contentIndex, contentItem;
				collection.event.value = new nxt.Command('Content', 'get', {
					items: [], // so that collection's event cell converter doesn't complain
					next: function(content) {
						content.some(function(item, index) {
							var found = item.isEqualNode(target) || item.contains(target);
							if (found) {
								contentIndex = index;
								contentItem = item;
							}
							return found;
						});
						var selectors = Object.keys(event.handlers);
						var callMatchingHandlers = function(selector) {
							if (target.matches(selector)) {
								event.handlers[selector].call(
									null,
									evt,
									collection.items[contentIndex]
								);
							}
						};
						while (!contentItem.isEqualNode(target)) {
							selectors.forEach(callMatchingHandlers);
							target = target.parentNode;
						}
						selectors.forEach(callMatchingHandlers);
					}
				});
			});
		});
		return [commandCell].concat(delegatedEvents);
	} else {
		return commandCell;
	}
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
