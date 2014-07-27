describe('nxt.NodeRenderer', function() {
	'use strict';

	var renderer;
	var domContext;

	beforeEach(function () {
		renderer = new nxt.NodeRenderer();
		domContext = { container: document.createElement('div') };
	});

	describe('render', function() {
		it('appends an element to the container if there is no insert reference and replace flag is not set', function() {
			var data = nxt.Element('span', nxt.Text('cellar door').data);
			renderer.render(data, domContext);
			domContext.container.childNodes.length.should.equal(1);
			domContext.container.textContent.should.equal('cellar door');
		});

		it('appends a text node to an element if there is no insert reference and replace flag is not set', function() {
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

		it('replaces previously rendered content if replace flag is set to true', function() {
			var content;
			content = renderer.render(nxt.Element('span', nxt.Text('before')).data, domContext);
			domContext.container.textContent.should.equal('before');
			domContext.replace = true;
			domContext.content = content;
			content = renderer.render(nxt.Element('span', nxt.Text('after')).data, domContext);
			domContext.container.textContent.should.equal('after');
			domContext.content = content;
			domContext.replace = false;
			renderer.render(nxt.Element('span', nxt.Text('party')).data, domContext);
			domContext.container.textContent.should.equal('afterparty');
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

		// it('clears rendered content when called with undefined or no parameters', function(){
		// 	renderer.render(domContext, nxt.Element('span', nxt.Text('cellar door')));
		// 	element.childNodes.length.should.equal(1);
		// 	element.textContent.should.equal('cellar door');
		// 	renderer.render();
		// 	should.not.exist(renderer.content);
		// 	element.childNodes.length.should.equal(0);
		// 	element.textContent.should.be.empty;
		// });
	});

	describe('visible', function () {
		it('returns true for node-type content', function () {
			renderer.visible(domContext.container).should.equal(true);
			renderer.visible(undefined).should.equal(false);
		});
	});

	describe('unrender', function () {
		it('removes nodes from the container', function() {
			var data = nxt.Element('span', nxt.Text('cellar door').data);
			domContext.content = renderer.render(data, domContext);
			domContext.container.childNodes.length.should.equal(1);
			domContext.container.textContent.should.equal('cellar door');
			renderer.unrender(domContext);
			domContext.container.childNodes.length.should.equal(0);
			domContext.container.textContent.should.equal('');
		});
	});
});
