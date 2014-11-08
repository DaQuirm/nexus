describe('nxt.NodeRenderer', function() {
	'use strict';

	var renderer;
	var domContext;

	beforeEach(function () {
		renderer = new nxt.NodeRenderer();
		domContext = { container: document.createElement('div') };
	});

	describe('render', function() {
		it('appends an element to the container if there is no insert reference and no previously rendered content', function() {
			var data = nxt.Element('span', nxt.Text('cellar door')).data;
			renderer.render(data, domContext);
			domContext.container.childNodes.length.should.equal(1);
			domContext.container.textContent.should.equal('cellar door');
		});

		it('appends a text node to an element if there is no insert reference and no previously rendered content', function() {
			renderer.render(nxt.Text('cellar door').data, domContext);
			domContext.container.childNodes.length.should.equal(1);
			domContext.container.textContent.should.equal('cellar door');
		});

		it('returns created node', function() {
			var content = renderer.render(new nxt.Element('span', new nxt.Text('cellar door')).data, domContext);
			content.nodeType.should.equal(Node.ELEMENT_NODE);
			content.nodeName.toLowerCase().should.equal('span');
			content.textContent.should.equal('cellar door');
			content.parentElement.should.equal(domContext.container);
		});

		it('replaces previously rendered content if it is present', function() {
			var content = renderer.render(nxt.Element('span', nxt.Text('before')).data, domContext);
			domContext.container.textContent.should.equal('before');
			domContext.content = content;
			content = renderer.render(nxt.Element('span', nxt.Text('after')).data, domContext);
			domContext.container.textContent.should.equal('after');
		});

		it('inserts an element node before another node if an insert reference has been set', function() {
			var movieNode = document.createElement('span');
			movieNode.textContent = 'Lethal Weapon II';
			domContext.container.appendChild(movieNode);
			domContext.insertReference = movieNode;
			renderer.render(nxt.Element('span', nxt.Text('Lethal Weapon I')).data, domContext);
			domContext.container.childNodes.length.should.equal(2);
			domContext.container.childNodes[0].textContent.should.equal('Lethal Weapon I');
			domContext.container.childNodes[0].nodeName.toLowerCase().should.equal('span');
			domContext.container.childNodes[1].textContent.should.equal('Lethal Weapon II');
			domContext.container.childNodes[1].nodeName.toLowerCase().should.equal('span');
		});

		it('replaces existing content even if insert reference is present', function () {
			var movieNode = document.createElement('span');
			movieNode.textContent = 'Lethal Weapon II';
			domContext.container.appendChild(movieNode);
			domContext.insertReference = movieNode;
			domContext.content = renderer.render(nxt.Element('span', nxt.Text('Beverly Hills Cop')).data, domContext);
			renderer.render(nxt.Element('span', nxt.Text('Lethal Weapon I')).data, domContext);
			domContext.container.childNodes.length.should.equal(2);
			domContext.container.childNodes[0].textContent.should.equal('Lethal Weapon I');
			domContext.container.childNodes[0].nodeName.toLowerCase().should.equal('span');
			domContext.container.childNodes[1].textContent.should.equal('Lethal Weapon II');
			domContext.container.childNodes[1].nodeName.toLowerCase().should.equal('span');
		});
	});

	describe('isVisible', function () {
		it('returns true for node-type content', function () {
			renderer.visible(document.createElement('a')).should.equal(true);
			renderer.visible(document.createTextNode('a')).should.equal(true);
			renderer.visible(undefined).should.equal(false);
			renderer.visible({}).should.equal(false);
		});
	});

	describe('unrender', function () {
		it('removes nodes from the container', function() {
			var data = nxt.Element('span', nxt.Text('cellar door')).data;
			domContext.content = renderer.render(data, domContext);
			domContext.container.childNodes.length.should.equal(1);
			domContext.container.textContent.should.equal('cellar door');
			renderer.unrender(domContext);
			domContext.container.childNodes.length.should.equal(0);
			domContext.container.textContent.should.equal('');
		});
	});
});
