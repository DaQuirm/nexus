describe('nxt helpers', function() {
	'use strict';

	describe('nxt.Attr', function() {
		it('creates an attribute name-value object', function() {
			var obj = nxt.Attr('class', 'button-big-red');
			obj.name.should.equal('class');
			obj.value.should.equal('button-big-red');
			obj.type.should.equal('Attr');
		});

		it('creates an attribute collection object', function() {
			var obj = nxt.Attr({
				'class': 'button-big-red',
				'data-label': 'Hit me!'
			});
			obj.items.should.deep.equal({
				'class': 'button-big-red',
				'data-label': 'Hit me!'
			})
			obj.type.should.equal('Attr');
		});
	});

	describe('nxt.Class', function() {
		it('creates a class-toggling object based on class name and a boolean value', function () {
			var obj = nxt.Class('cellar-door', true);
			obj.name.should.equal('cellar-door');
			obj.set.should.equal(true);
			obj.type.should.equal('Class');
		});
	});

	describe('nxt.Text', function() {
		it('creates a text object containing a text node', function() {
			var obj = nxt.Text('cellar door');
			obj.text.should.equal('cellar door');
			obj.node.nodeType.should.equal(Node.TEXT_NODE);
			obj.node.nodeValue.should.equal('cellar door');
			obj.type.should.equal('Node');
		});

		it('returns undefined if text value is undefined', function() {
			var result = nxt.Text();
			should.not.exist(result);
			var obj = nxt.Text('');
			obj.text.should.equal('');
			obj.node.nodeType.should.equal(Node.TEXT_NODE);
			obj.node.nodeValue.should.equal('');
			obj.type.should.equal('Node');
		});
	});

	describe('nxt.Event', function() {
		it('creates an event handler object', function() {
			var handler = function (evt) {
				evt.preventDefault();
			};
			var obj = nxt.Event('mouseover', handler);
			obj.name.should.equal('mouseover');
			obj.type.should.equal('Event');
		});
	});

	describe('nxt.Element', function() {
		it('creates an element object', function() {
			var obj = nxt.Element('div');
			obj.name.should.equal('div');
			obj.node.nodeType.should.equal(Node.ELEMENT_NODE);
			obj.node.nodeName.toLowerCase().should.equal('div');
			obj.type.should.equal('Node');
		});

		it('renders inner content', function() {
			var elem = nxt.Element('div',
				nxt.Attr('class', 'button-big-blue'),
				nxt.Text('Click Me!')
			);
			elem.node.childNodes.length.should.equal(1);
			elem.node.childNodes[0].nodeType.should.equal(Node.TEXT_NODE);
			elem.node.childNodes[0].nodeValue.should.equal('Click Me!');
			elem.node.attributes.length.should.equal(1);
			elem.node.getAttribute('class').should.equal('button-big-blue');
		});

		it('accepts both single content items and item arrays', function() {
			var elem = nxt.Element('div',
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
			elem.node.childNodes.length.should.equal(6);
			elem.node.textContent.should.equal('cellar door');
		});
	});

	describe('nxt.Binding', function() {
		it('creates a binding object', function () {
			var cell = new nx.Cell();
			var converter = function(value) { return -value; };
			var obj = nxt.Binding(cell, converter);
			obj.cell.should.equal(cell);
			obj.conversion.should.equal(converter);
			obj.type.should.equal('Binding');
			obj.dynamic.should.equal(true);
		});

		it('has `mode` set to `->` by default', function() {
			var cell = new nx.Cell();
			var converter = function(value) { return -value; };
			var obj = nxt.Binding(cell, converter);
			obj.mode.should.equal('->');
		});
	});

	describe('nxt.DelegatedEvent', function() {
		it('creates a delegated event object', function() {
			var handlerMap = {
				'li': function(evt, item) {} ,
				'a': function(evt, item) {}
			};
			var obj = nxt.DelegatedEvent('click', handlerMap);
			obj.handlers.should.deep.equal(handlerMap);
			obj.type.should.equal('DelegatedEvent');
			obj.name.should.equal('click');
		});
	});

	describe('nxt.Collection', function() {
		it('creates a collection object', function () {
			var collection = new nx.Collection();
			var converter = function(item) { return nxt.Text(item); };
			var obj = new nxt.Collection(collection, converter);
			obj.collection.should.equal(collection);
			obj.conversion.should.equal(converter);
			obj.type.should.equal('Collection');
			obj.dynamic.should.equal(true);
		});

		it('allows an arbitrary number of delegate event handlers to be passed', function() {
			var collection = new nx.Collection();
			var converter = function(item) { return nxt.Element('li', nxt.Element('a', nxt.Text(item))); };
			var linkEvent = nxt.DelegatedEvent('mouseover', { 'a': function(evt, item) {} });
			var obj = new nxt.Collection(
				collection,
				converter,
				nxt.DelegatedEvent('click', { 'li': function(evt, item) {} }),
				linkEvent
			);
			obj.collection.should.equal(collection);
			obj.conversion.should.equal(converter);
			obj.type.should.equal('Collection');
			obj.events.length.should.equal(2);
			obj.events[1].should.deep.equal(linkEvent);
			obj.dynamic.should.equal(true);
		});
	});
});
