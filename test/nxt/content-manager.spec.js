describe('nxt.ContentManager', function() {
	'use strict';

	var element;
	var domContext;
	var manager;

	beforeEach(function () {
		element = document.createElement('div');
		domContext = { container: element };
		manager = new nxt.ContentManager(domContext);
	});

	describe('render', function() {
		it('uses content renderers to append static items to the container', function() {
			manager.render(nxt.Element('span'), nxt.Text('cellar door'), nxt.Attr('class', 'container'));
			element.childNodes.length.should.equal(2);
			element.childNodes[0].nodeType.should.equal(Node.ELEMENT_NODE);
			element.childNodes[0].nodeName.toLowerCase().should.equal('span');
			element.childNodes[1].nodeType.should.equal(Node.TEXT_NODE);
			element.childNodes[1].nodeValue.should.equal('cellar door');
			element.getAttribute('class').should.equal('container');
		});

		it('passes its domContext container to the renderers', function() {
			var span = document.createElement('span');
			element.appendChild(span)
			manager.domContext = { container: element, insertReference: span };
			var spy = sinon.spy(nxt.NodeRenderer.prototype, 'render');
			var command = nxt.Element('span');
			manager.render(command);
			spy.should.have.been.calledWith(command.data, manager.domContext);
			nxt.NodeRenderer.prototype.render.restore();
		});

		it('creates content regions for all consecutive series of dynamic content items', function () {
			var cell = new nx.Cell();
			manager.render(
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
			);
			manager.regions.length.should.equal(3);
			manager.regions[0].should.be.an.instanceof(nxt.ContentRegion);
		});

		it('passes insert reference if a content region is followed by a static item', function () {
			var cell = new nx.Cell();
			manager.render(
				nxt.Attr('class', 'container'),
				nxt.Element('div'),
				nxt.Binding(cell, nxt.Text),
				nxt.Binding(cell, nxt.Text),
				nxt.Element('div', nxt.Text('cellar door'))
			);
			manager.regions[0].domContext.insertReference.nodeType.should.equal(Node.ELEMENT_NODE);
			manager.regions[0].domContext.insertReference.nodeName.toLowerCase().should.equal('div');
			manager.regions[0].domContext.insertReference.textContent.should.equal('cellar door');
			cell.value = 'a';
			element.lastChild.nodeName.toLowerCase().should.equal('div');
			element.lastChild.textContent.toLowerCase().should.equal('cellar door');
		});

		it('skips undefined items', function () {
			var cell = new nx.Cell();
			manager.render(
				void 0,
				nxt.Attr('class', 'container'),
				void 0,
				nxt.Element('span'),
				void 0,
				void 0,
				nxt.Element('div', nxt.Text('cellar door'))
			);
			element.childNodes.length.should.equal(2);
			element.childNodes[0].nodeType.should.equal(Node.ELEMENT_NODE);
			element.childNodes[0].nodeName.toLowerCase().should.equal('span');
			element.childNodes[1].nodeName.toLowerCase().should.equal('div');
			element.childNodes[1].textContent.should.equal('cellar door');
			element.getAttribute('class').should.equal('container');
		});
	});

});
