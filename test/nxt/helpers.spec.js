describe('nxt helpers', function() {
	'use strict';

	describe('nxt.Attr', function() {
		it('creates an attribute name-value command', function() {
			var command = nxt.Attr('class', 'button-big-red');
			command.type.should.equal('Attr');
			command.method.should.equal('render');
			command.data.should.deep.equal({ name: 'class', value: 'button-big-red' });
		});

		it('creates an attribute collection command', function() {
			var command = nxt.Attr({
				'class': 'button-big-red',
				'data-label': 'Hit me!'
			});
			command.type.should.equal('Attr');
			command.method.should.equal('render');
			command.data.items.should.deep.equal({
				'class': 'button-big-red',
				'data-label': 'Hit me!'
			});
		});

		it('sets attribute value to an empty string by default', function() {
			var command = nxt.Attr('selected');
			command.data.should.deep.equal({ name: 'selected', value: '' });
		});
	});

	describe('nxt.Class', function() {
		it('creates a class-toggling command based on class name and a boolean value', function () {
			var command = nxt.Class('cellar-door', true);
			command.type.should.equal('Class');
			command.method.should.equal('add');
			command.data.should.deep.equal({ name: 'cellar-door' });

			command = nxt.Class('cellar-door', false);
			command.type.should.equal('Class');
			command.method.should.equal('remove');
			command.data.should.deep.equal({ name: 'cellar-door' });
		});

		it('adds a class to the class list by default', function () {
			var command = nxt.Class('cellar-door');
			command.type.should.equal('Class');
			command.method.should.equal('add');
			command.data.should.deep.equal({ name: 'cellar-door' });
		});
	});

	describe('nxt.Text', function() {
		it('creates a text command containing a text node', function() {
			var command = nxt.Text('cellar door');
			command.type.should.equal('Node');
			command.method.should.equal('render');
			command.data.text.should.equal('cellar door');
			command.data.node.nodeType.should.equal(Node.TEXT_NODE);
			command.data.node.nodeValue.should.equal('cellar door');
		});

		it('returns undefined if text value is undefined', function() {
			var result = nxt.Text();
			should.not.exist(result);
			var command = nxt.Text('');
			command.type.should.equal('Node');
			command.method.should.equal('render');
			command.data.text.should.equal('');
			command.data.node.nodeType.should.equal(Node.TEXT_NODE);
			command.data.node.nodeValue.should.equal('');
		});
	});

	describe('nxt.Event', function() {
		it('creates an event command', function() {
			var handler = function (evt) {
				evt.preventDefault();
			};
			var command = nxt.Event('mouseover', handler);
			command.type.should.equal('Event');
			command.method.should.equal('add');
			command.data.name.should.equal('mouseover');
		});
	});

	describe('nxt.Element', function() {
		it('creates an element command', function() {
			var command = nxt.Element('div');
			command.type.should.equal('Node');
			command.method.should.equal('render');
			command.data.node.nodeType.should.equal(Node.ELEMENT_NODE);
			command.data.node.nodeName.toLowerCase().should.equal('div');
		});

		it('renders inner content', function() {
			var command = nxt.Element('div',
				nxt.Attr('class', 'button-big-blue'),
				nxt.Text('Click Me!')
			);
			command.data.node.childNodes.length.should.equal(1);
			command.data.node.childNodes[0].nodeType.should.equal(Node.TEXT_NODE);
			command.data.node.childNodes[0].nodeValue.should.equal('Click Me!');
			command.data.node.attributes.length.should.equal(1);
			command.data.node.getAttribute('class').should.equal('button-big-blue');
		});

		it('accepts both single content items and item arrays', function() {
			var command = nxt.Element('div',
				nxt.Attr('class', 'button-big-blue'),
				nxt.Text('ce'),
				[
					nxt.Text('ll'),
					nxt.Text('ar'),
					nxt.Text(' '),
					nxt.Text('do')
				],
				nxt.Text('or')
			);
			command.data.node.childNodes.length.should.equal(6);
			command.data.node.textContent.should.equal('cellar door');
		});
	});

	describe('nxt.Binding', function() {
		it('creates a binding command cell', function () {
			var cell = new nx.Cell();
			var converter = function(value) { return nxt.Text(value); };
			var commandCell = nxt.Binding(cell, converter);
			cell.value = 'cellar door';
			commandCell.value.type.should.equal('Node');
			commandCell.value.method.should.equal('render');
			commandCell.value.data.text.should.equal('cellar door');
			commandCell.value.data.node.nodeType.should.equal(Node.TEXT_NODE);
			commandCell.value.data.node.nodeValue.should.equal('cellar door');
		});

		it('creates a bi-directionally bound command cell when two converters are passed', function () {
			var cell = new nx.Cell({ value: '' });
			var commandCell = nxt.Binding(
				cell,
				function (value) {
					return value.toUpperCase();
				},
				function (value) {
					return value.toLowerCase();
				}
			);
			cell.value = 'cellar door';
			commandCell.value.should.equal('CELLAR DOOR');
			commandCell.value = 'SNASA'
			cell.value.should.equal('snasa');
		});
	});

	describe('nxt.ItemEvent', function() {
		it('creates a delegated event object', function() {
			var handlerMap = {
				'li': function(evt, item) {} ,
				'a': function(evt, item) {}
			};
			var command = nxt.ItemEvent('click', handlerMap);
			command.handlers.should.deep.equal(handlerMap);
			command.name.should.equal('click');
		});
	});

	describe('nxt.Collection', function() {
		it('creates a collection command cell', function () {
			var collection = new nx.Collection();
			var converter = function(item) { return nxt.Text(item); };
			var commandCell = new nxt.Collection(collection, converter);
			collection.append('cellar door');
			commandCell.value.type.should.equal('Content');
			var textCommand = commandCell.value.data.items[0];
			textCommand.type.should.equal('Node');
			textCommand.method.should.equal('render');
			textCommand.data.text.should.equal('cellar door');
			textCommand.data.node.nodeType.should.equal(Node.TEXT_NODE);
			textCommand.data.node.nodeValue.should.equal('cellar door');
		});

		it('assigns a `reset` command to the event cell to make the first rendering include all collection items', function () {
			var collection = new nx.Collection();
			var converter = function(item) { return nxt.Text(item); };
			collection.append('1');
			collection.append('3');
			collection.insertBefore('3', '2');
			var commandCell = new nxt.Collection(collection, converter);
			commandCell.value.should.deep.equal(
				new nxt.Command('Content', 'reset', { items: ['1', '2', '3'].map(converter) })
			);
		});

		it('returns a command cell and event commands if item event handlers are passed', function () {
			var collection = new nx.Collection({ items: ['1', '2', '3'] });
			var handler = function(evt, item) {};
			var converter = function(item) {
				return nxt.Element('li',
					nxt.Element('span',
						nxt.Text(item)
					)
				)
			};
			var items = nxt.Collection(collection, converter,
				nxt.ItemEvent('click', {
					'span': handler
				}),
				nxt.ItemEvent('mouseover', {
					'div': handler
				})
			);
			items.length.should.equal(3);
			items[0].value.should.deep.equal(
				new nxt.Command('Content', 'reset', { items: collection.items.map(converter) })
			);
			items[1].type.should.deep.equal('Event');
			items[1].method.should.deep.equal('add');
			items[2].type.should.deep.equal('Event');
			items[2].method.should.deep.equal('add');
		});

		it('attaches delegated item event handlers', function(done) {
			var domContext = {
				container: document.createElement('ul')
			};
			document.body.appendChild(domContext.container);
			var collection = new nx.Collection({ items: ['a','b','c'] });
			var renderer = new nxt.ContentRenderer();
			renderer.render({
				items: nxt.Collection(collection, function(item) {
						return nxt.Element('li',
							nxt.Element('span',
								nxt.Text(item)
							)
						)
					},
					nxt.ItemEvent('click', {
						'span': function(evt, item) {
							item.should.equal('c');
							document.body.removeChild(domContext.container);
							done();
						}
					})
				)
			}, domContext);
			domContext.container.childNodes[2].childNodes[0].click();
		});
	});

	describe('nxt.ValueBinding', function() {
		it('binds a cell with an input value bidirectionally', function () {
			var cell = new nx.Cell({ value: '' });
			var input = nxt.Element('input',
				nxt.ValueBinding(
					cell,
					function (value) {
						return value.toUpperCase();
					},
					function (value) {
						return value.toLowerCase();
					}
				)
			);
			input.data.node.value = 'CELLAR';
			var event = new Event('input');
			input.data.node.dispatchEvent(event);
			cell.value.should.equal('cellar');
			cell.value = 'door';
			input.data.node.value.should.equal('DOOR');

			// and once again, just in case
			input.data.node.value = 'CELLAR';
			var event = new Event('input');
			input.data.node.dispatchEvent(event);
			cell.value.should.equal('cellar');
		});

		it('initializes input with cell value', function () {
			var cell = new nx.Cell({ value: 'cellar door' });
			var input = nxt.Element('input', nxt.ValueBinding(cell));
			input.data.node.value.should.equal('cellar door');
		});

		it('handles value binding when no converters are specified', function () {
			var cell = new nx.Cell({ value: '' });
			var input = nxt.Element('input', nxt.ValueBinding(cell));
			input.data.node.value = 'cellar';
			var event = new Event('input');
			input.data.node.dispatchEvent(event);
			cell.value.should.equal('cellar');
			cell.value = 'door';
			input.data.node.value.should.equal('door');

			// and once again, just in case
			input.data.node.value = 'cellar';
			var event = new Event('input');
			input.data.node.dispatchEvent(event);
			cell.value.should.equal('cellar');
		});
	});

});
