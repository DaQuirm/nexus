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
	var commandCell = new nxt.CommandCell();
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
	var locked = false;
	var eventCommand = nxt.Event('input', function () {
		locked = true;
		cell.value = backConversion ? backConversion(this.value) : this.value;
	});

	var commandCell = new nx.Cell();
	commandCell.value = nxt.Attr('value', conversion ? conversion(cell.value) : cell.value);
	cell.onvalue.add(function (value) {
		if (!locked) {
			commandCell.value = nxt.Attr('value', conversion ? conversion(value) : value);
		} else {
			locked = false;
		}
	});

	return [eventCommand, commandCell];
};
