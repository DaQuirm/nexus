describe('nxt.ContentManager', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a content managing istance for a container element', function() {
			var element = document.createElement('div');
			var manager = new nxt.ContentManager(element);
			manager.element.should.equal(element);
		});
	});

	describe('render', function() {
		it('creates appropriate static renderers for content items or reuses existing ones', function () {
			var element = document.createElement('div');
			var manager = new nxt.ContentManager(element);
			manager.render(nxt.Element('span'), nxt.Text('cellar door'), nxt.Attr('class', 'container'));
			Object.keys(manager.renderers).length.should.equal(3);
			manager.render(nxt.Text('cellar door'));
			Object.keys(manager.renderers).length.should.equal(3);
		});

		it('uses content renderers to append static items to the container', function() {
			var element = document.createElement('div');
			var manager = new nxt.ContentManager(element);
			manager.render(nxt.Element('span'), nxt.Text('cellar door'), nxt.Attr('class', 'container'));
			element.childNodes.length.should.equal(2);
			element.childNodes[0].nodeType.should.equal(Node.ELEMENT_NODE);
			element.childNodes[0].nodeName.toLowerCase().should.equal('span');
			element.childNodes[1].nodeType.should.equal(Node.TEXT_NODE);
			element.childNodes[1].nodeValue.should.equal('cellar door');
			element.getAttribute('class').should.equal('container');
		});

		it('creates content regions for all consecutive series of dynamic content items', function () {
			var element = document.createElement('div');
			var manager = new nxt.ContentManager(element);
			var property = new nx.Property();
			manager.render(
				nxt.Attr('class', 'container'),
				nxt.Element('div'),
				nxt.Binding(property, function(value) { return value; }),
				nxt.Binding(property, function(value) { return value; }),
				nxt.Element('div'),
				nxt.Binding(property, function(value) { return value; }),
				nxt.Element('div'),
				nxt.Element('div'),
				nxt.Binding(property, function(value) { return value; }),
				nxt.Binding(property, function(value) { return value; }),
				nxt.Binding(property, function(value) { return value; })
			);
			manager.regions.length.should.equal(3);
			manager.regions[0].should.be.an.instanceof(nxt.ContentRegion);
		});

		it('passes container element reference to content regions', function () {
			var element = document.createElement('div');
			var manager = new nxt.ContentManager(element);
			var property = new nx.Property();
			manager.render(
				nxt.Element('div'),
				nxt.Binding(property, function(value) { return value; }),
				nxt.Binding(property, function(value) { return value; })
			);
			manager.regions[0].element.should.equal(element);
		});

		it('passes insert reference if a content region is followed by a static item', function () {
			var element = document.createElement('div');
			var manager = new nxt.ContentManager(element);
			var property = new nx.Property();
			manager.render(
				nxt.Attr('class', 'container'),
				nxt.Element('div'),
				nxt.Binding(property, nxt.Text),
				nxt.Binding(property, nxt.Text),
				nxt.Element('div', nxt.Text('cellar door'))
			);
			manager.regions[0].insertReference.nodeType.should.equal(Node.ELEMENT_NODE);
			manager.regions[0].insertReference.nodeName.toLowerCase().should.equal('div');
			manager.regions[0].insertReference.textContent.should.equal('cellar door');
			property.value = 'a';
			element.lastChild.nodeName.toLowerCase().should.equal('div');
			element.lastChild.textContent.toLowerCase().should.equal('cellar door');
		});
	});

	describe('contentReference', function () {
		it('points to rendered content', function () {
			var element = document.createElement('div');
			var manager = new nxt.ContentManager(element);
			var property = new nx.Property();
			manager.render(
				nxt.Attr('class', 'container'),
				nxt.Element('div', nxt.Text('cellar door')),
				nxt.Binding(property, function(value) { return value; }),
				nxt.Binding(property, function(value) { return value; }),
				nxt.Element('div')
			);
			manager.contentReference.nodeName.toLowerCase().should.equal('div');
			manager.contentReference.textContent.should.equal('cellar door');
		});
	});
});
