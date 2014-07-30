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
	});

	describe('nxt.DelegatedEvent', function() {
		it('creates a delegated event command', function() {
			var handlerMap = {
				'li': function(evt, item) {} ,
				'a': function(evt, item) {}
			};
			var command = nxt.DelegatedEvent('click', handlerMap);
			command.type.should.equal('DelegatedEvent');
			command.method.should.equal('add');
			command.data.handlers.should.deep.equal(handlerMap);
			command.data.name.should.equal('click');
		});
	});

	describe('nxt.Collection', function() {
		it('creates a collection command cell', function () {
			var collection = new nx.Collection();
			var converter = function(item) { return nxt.Text(item); };
			var commandCell = new nxt.Collection(collection, converter);
			collection.append('cellar door');
			commandCell.value.type.should.equal('Collection');
			var textCommand = commandCell.value.data.items[0];
			textCommand.type.should.equal('Node');
			textCommand.method.should.equal('render');
			textCommand.data.text.should.equal('cellar door');
			textCommand.data.node.nodeType.should.equal(Node.TEXT_NODE);
			textCommand.data.node.nodeValue.should.equal('cellar door');
		});

		it('allows an arbitrary number of delegate event handlers to be passed', function() {
			var collection = new nx.Collection();
			var converter = function(item) { return nxt.Element('li', nxt.Element('a', nxt.Text(item))); };
			var linkEvent = nxt.DelegatedEvent('mouseover', { 'a': function(evt, item) {} });
			var command = new nxt.Collection(
				collection,
				converter,
				nxt.DelegatedEvent('click', { 'li': function(evt, item) {} }),
				linkEvent
			);
			command.collection.should.equal(collection);
			command.conversion.should.equal(converter);
			command.type.should.equal('Collection');
			command.events.length.should.equal(2);
			command.events[1].should.deep.equal(linkEvent);
			command.dynamic.should.equal(true);
		});
	});
});
