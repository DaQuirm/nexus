describe('nxt.ContentManager', function() {
	'use strict';

	var element;
	var domContext;
	var manager;

	beforeEach(function () {
		element = document.createElement('div');
		domContext = { container: element };
		manager = new nxt.ContentManager();
	});

	describe('render', function() {
		it('uses content renderers to append static items to the container', function() {
			manager.render([nxt.Element('span'), nxt.Text('cellar door'), nxt.Attr('class', 'container')], domContext);
			element.childNodes.length.should.equal(2);
			element.childNodes[0].nodeType.should.equal(Node.ELEMENT_NODE);
			element.childNodes[0].nodeName.toLowerCase().should.equal('span');
			element.childNodes[1].nodeType.should.equal(Node.TEXT_NODE);
			element.childNodes[1].nodeValue.should.equal('cellar door');
			element.getAttribute('class').should.equal('container');
		});

		it('passes its domContext container to the renderers', function() {
			var span = document.createElement('span');
			element.appendChild(span);
			domContext = { container: element, insertReference: span };
			var spy = sinon.spy(nxt.NodeRenderer.prototype, 'render');
			var command = nxt.Element('span');
			manager.render([command], domContext);
			spy.should.have.been.calledWith(command.data, domContext);
			nxt.NodeRenderer.prototype.render.restore();
		});

		it('creates content regions for all consecutive series of dynamic content items', function () {
			var cell = new nx.Cell();
			manager.render([
				nxt.Attr('class', 'container'),
				nxt.Element('div'),
				nxt.Binding(cell, function(value) { return value; }),
				nxt.Binding(cell, function(value) { return value; }),
				nxt.Element('div'),
				nxt.Binding(cell, function(value) { return value; }),
				nxt.Element('div'),
				nxt.Element('div'),
				nxt.Binding(cell, function(value) { return value; }),
				nxt.Binding(cell, function(value) { return value; }),
				nxt.Binding(cell, function(value) { return value; })
			], domContext);
			manager.regions.length.should.equal(3);
			manager.regions[0].should.be.an.instanceof(nxt.ContentRegion);
		});

		it('passes insert reference if a content region is followed by a static item', function () {
			var cell = new nx.Cell();
			manager.render([
				nxt.Attr('class', 'container'),
				nxt.Element('div'),
				nxt.Binding(cell, nxt.Text),
				nxt.Binding(cell, nxt.Text),
				nxt.Element('div', nxt.Text('cellar door'))
			], domContext);
			manager.regions[0].domContext.insertReference.nodeType.should.equal(Node.ELEMENT_NODE);
			manager.regions[0].domContext.insertReference.nodeName.toLowerCase().should.equal('div');
			manager.regions[0].domContext.insertReference.textContent.should.equal('cellar door');
			cell.value = 'a';
			element.lastChild.nodeName.toLowerCase().should.equal('div');
			element.lastChild.textContent.toLowerCase().should.equal('cellar door');
		});

		it('skips undefined items', function () {
			var cell = new nx.Cell();
			manager.render([
				void 0,
				nxt.Attr('class', 'container'),
				void 0,
				nxt.Element('span'),
				void 0,
				void 0,
				nxt.Element('div', nxt.Text('cellar door'))
			], domContext);
			element.childNodes.length.should.equal(2);
			element.childNodes[0].nodeType.should.equal(Node.ELEMENT_NODE);
			element.childNodes[0].nodeName.toLowerCase().should.equal('span');
			element.childNodes[1].nodeName.toLowerCase().should.equal('div');
			element.childNodes[1].textContent.should.equal('cellar door');
			element.getAttribute('class').should.equal('container');
		});

		it('collects rendered content into the content array and returns it', function () {
			var content = manager.render([
				nxt.Element('header'),
				nxt.Element('main', nxt.Text('cellar door')),
				nxt.Element('footer')
			], domContext);
			content.length.should.equal(3);
			content[0].nodeName.toLowerCase().should.equal('header');
			content[1].nodeName.toLowerCase().should.equal('main');
			content[2].nodeName.toLowerCase().should.equal('footer');
		});
	});

	describe('insertBefore', function () {
		it('inserts content items before a an item with specified index', function () {
			var content = manager.render([
				nxt.Element('header'),
				nxt.Element('footer')
			], domContext);
			domContext = { container: element, content: content };
			content = manager.insertBefore(1, [nxt.Text('cellar '), nxt.Text('door')], domContext);
			content.length.should.equal(4);
			element.textContent.should.equal('cellar door');
		});
	});

	describe('remove', function () {
		it('removes items with specified indexes', function () {
			var content = manager.render([
				nxt.Element('header'),
				nxt.Element('main', nxt.Text('cellar door')),
				nxt.Element('footer')
			], domContext);
			domContext = { container: element, content: content };
			content = manager.remove([0,2], domContext);
			content.length.should.equal(1);
			content[0].nodeName.toLowerCase().should.equal('main');
		});
	});

});
