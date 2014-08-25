describe('nxt.ContentRenderer', function() {
	'use strict';

	var element;
	var domContext;
	var renderer;

	beforeEach(function () {
		element = document.createElement('div');
		domContext = { container: element };
		renderer = new nxt.ContentRenderer();
	});

	describe('render', function() {
		it('uses content renderers to append static items to the container', function() {
			renderer.render({
				items: [
					nxt.Element('span'),
					nxt.Text('cellar door'),
					nxt.Attr('class', 'container')
				]
			}, domContext);
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
			renderer.render({ items: [command] }, domContext);
			spy.should.have.been.calledWith(command.data, domContext);
			nxt.NodeRenderer.prototype.render.restore();
		});

		it('creates content regions for all consecutive series of dynamic content items', function () {
			var cell = new nx.Cell();
			renderer.render({
				items: [
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
				]
			}, domContext);
			renderer.regions.length.should.equal(3);
			renderer.regions[0].should.be.an.instanceof(nxt.ContentRegion);
		});

		it('passes insert reference if a content region is followed by a static item', function () {
			var cell = new nx.Cell();
			renderer.render({
				items: [
					nxt.Attr('class', 'container'),
					nxt.Element('div'),
					nxt.Binding(cell, nxt.Text),
					nxt.Binding(cell, nxt.Text),
					nxt.Element('div', nxt.Text('cellar door'))
				]
			}, domContext);
			renderer.regions[0].domContext.insertReference.nodeType.should.equal(Node.ELEMENT_NODE);
			renderer.regions[0].domContext.insertReference.nodeName.toLowerCase().should.equal('div');
			renderer.regions[0].domContext.insertReference.textContent.should.equal('cellar door');
			cell.value = 'a';
			element.lastChild.nodeName.toLowerCase().should.equal('div');
			element.lastChild.textContent.toLowerCase().should.equal('cellar door');
		});

		it('skips undefined items', function () {
			var cell = new nx.Cell();
			renderer.render({
				items: [
					void 0,
					nxt.Attr('class', 'container'),
					void 0,
					nxt.Element('span'),
					void 0,
					void 0,
					nxt.Element('div', nxt.Text('cellar door'))
				]
			}, domContext);
			element.childNodes.length.should.equal(2);
			element.childNodes[0].nodeType.should.equal(Node.ELEMENT_NODE);
			element.childNodes[0].nodeName.toLowerCase().should.equal('span');
			element.childNodes[1].nodeName.toLowerCase().should.equal('div');
			element.childNodes[1].textContent.should.equal('cellar door');
			element.getAttribute('class').should.equal('container');
		});

		it('collects rendered content into the content array and returns it', function () {
			var content = renderer.render({
				items: [
					nxt.Element('header'),
					nxt.Element('main', nxt.Text('cellar door')),
					nxt.Element('footer')
				]
			}, domContext);
			content.length.should.equal(3);
			content[0].nodeName.toLowerCase().should.equal('header');
			content[1].nodeName.toLowerCase().should.equal('main');
			content[2].nodeName.toLowerCase().should.equal('footer');
		});
	});

	describe('append', function () {
		it('appends content items to the container', function () {
			var content = renderer.render({ items: [nxt.Element('header')] }, domContext);
			domContext = { container: element, content: content };
			content = renderer.append({
				items: [
					nxt.Element('main', nxt.Text('cellar door')),
					nxt.Element('footer')
				]
			}, domContext);
			content.length.should.equal(3);
			content[0].nodeName.toLowerCase().should.equal('header');
			content[1].nodeName.toLowerCase().should.equal('main');
			content[2].nodeName.toLowerCase().should.equal('footer');
		});
	});

	describe('insertBefore', function () {
		it('inserts content items before an item with specified index', function () {
			var content = renderer.render({
				items: [
					nxt.Element('header'),
					nxt.Element('footer')
				]
			}, domContext);
			domContext = { container: element, content: content };
			content = renderer.insertBefore({
				index: 1,
				items: [
					nxt.Text('cellar '),
					nxt.Text('door')
				]
			}, domContext);
			content.length.should.equal(4);
			element.textContent.should.equal('cellar door');
		});
	});

	describe('remove', function () {
		it('removes items with specified indexes', function () {
			var content = renderer.render({
				items: [
					nxt.Element('header'),
					nxt.Element('main', nxt.Text('cellar door')),
					nxt.Element('footer')
				]
			}, domContext);
			domContext = { container: element, content: content };
			content = renderer.remove({
				indexes: [0,2]
			}, domContext);
			content.length.should.equal(1);
			content[0].nodeName.toLowerCase().should.equal('main');
		});
	});

	describe('reset', function () {
		it('replaces existing content items and renders news items', function () {
			var content = renderer.render({
				items: [
					nxt.Element('header'),
					nxt.Element('main', nxt.Text('cellar door')),
					nxt.Element('footer')
				]
			}, domContext);
			domContext = { container: element, content: content };
			content = renderer.reset({
				items: [
					nxt.Element('img'),
					nxt.Element('div', nxt.Text('cellar door')),
					nxt.Element('span')
				]
			}, domContext);
			content.length.should.equal(3);
			content[0].nodeName.toLowerCase().should.equal('img');
			content[1].nodeName.toLowerCase().should.equal('div');
			content[1].textContent.should.deep.equal('cellar door');
			content[2].nodeName.toLowerCase().should.equal('span');
		});

		it('doesn\'t remove all element\'s child nodes when all collection items are removed', function () {
			var container = document.createElement('ul');
			var listItem = document.createElement('li');
			listItem.textContent = 'a';
			container.appendChild(listItem);
			var conversion = function(value) {
				return nxt.Element('li', nxt.Text(value));
			};
			domContext.container = container;
			domContext.content = renderer.append({
				items: ['b','c','d'].map(conversion)
			}, domContext);
			container.textContent.should.equal('abcd');
			renderer.reset({ items:[] }, domContext);
			container.textContent.should.equal('a');
			container.childNodes.length.should.equal(1);
		});
	});

	describe('get', function () {
		it('passes renderer\'s content to a command callback', function (done) {
			var container = document.createElement('ul');
			var conversion = function(value) {
				return nxt.Element('li', nxt.Text(value));
			};
			domContext.container = container;
			domContext.content = renderer.append({
				items: ['a','b','c','d'].map(conversion)
			}, domContext);
			container.textContent.should.equal('abcd');
			renderer.get({
				next: function(content) {
					content.length.should.equal(4);
					content[0].textContent.should.equal('a');
					content[1].textContent.should.equal('b');
					content[2].textContent.should.equal('c');
					content[3].textContent.should.equal('d');
					done();
				}
			}, domContext);
		});
	});

	describe('visible', function () {
		it('returns true for non-empty collection content', function () {
			renderer.visible([]).should.equal(false);
			renderer.visible([1,2,3]).should.equal(true);
		});
	});

});