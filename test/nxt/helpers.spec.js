describe('nxt helpers', function() {
	'use strict';

	describe('nxt.Attr', function() {
		it('creates an attribute name-value object', function() {
			var obj = nxt.Attr('class', 'button-big-red');
			obj.name.should.equal('class');
			obj.value.should.equal('button-big-red');
			obj.type.should.equal('Attr');
		});
	});

	describe('nxt.Text', function() {
		it('creates a text object containing a text node', function() {
			var obj = nxt.Text('cellar door');
			obj.text.should.equal('cellar door');
			obj.node.nodeType.should.equal(Node.TEXT_NODE);
			obj.node.nodeValue.should.equal('cellar door');
			obj.type.should.equal('Text');
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
			obj.node.nodeName.should.equal('div');
			obj.type.should.equal('Element');
		});

		it('renders inner content', function() {
			var elem = nxt.Element('div',
				nxt.Attr('class', 'button-big-blue'),
				nxt.Text('Click Me!')
			);
			elem.childNodes.length.should.equal(1);
			elem.childNodes[0].nodeType.should.equal(Node.TEXT_NODE);
			elem.childNodes[0].nodeValue.should.equal('Click Me!');
			elem.attributes.length.should.equal(1);
			elem.getAttribute('class').should.equal('button-big-blue');
		});
	});

	describe('nxt.Binding', function() {
		it('creates a binding object', function () {
			var property = new nx.Property();
			var converter = function(value) { return -value; };
			var obj = nxt.Binding(property, converter);
			obj.property.should.equal(property);
			obj.conversion.should.equal(converter);
			obj.type.should.equal('Binding');
		});

		it('has mode set to `->` by default', function() {
			var property = new nx.Property();
			var converter = function(value) { return -value; };
			var obj = nxt.Binding(property, converter);
			obj.mode.should.equal('->');
		});
	});

	describe('nxt.Collection', function() {
		it('creates a collection object', function () {
			var collection = new nx.Collection();
			var converter = function(item) { return nxt.Text(value); }
			var obj = new nxt.Collection(collection, converter);
			obj.collection.should.equal(collection);
			obj.conversion.should.equal(converter);
			obj.type.should.equal('Collection');
		});
	});
});
