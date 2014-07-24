describe('nxt.NodeRenderer', function() {
	'use strict';

	describe('render', function() {

		var renderer;
		var domContext;

		beforeEach(function () {
			renderer = new nxt.NodeRenderer();
			domContext = { container: document.createElement('div') };
		});

		it('appends an element to the container if there is no insert reference and replace flag is not set', function() {
			var data = nxt.Element('span', nxt.Text('cellar door'));
			renderer.render(domContext, data);
			domContext.container.childNodes.length.should.equal(1);
			domContext.container.textContent.should.equal('cellar door');
		});

		it('appends a text node to an element if there is no insert reference and replace flag is not set', function() {
			renderer.render(domContext, nxt.Text('cellar door'));
			domContext.childNodes.length.should.equal(1);
			domContext.textContent.should.equal('cellar door');
		});

		it('returns created node', function() {
			var content = renderer.render(domContext, new nxt.Element('span', new nxt.Text('cellar door')));
			content.nodeType.should.equal(Node.ELEMENT_NODE);
			content.nodeName.toLowerCase().should.equal('span');
			content.textContent.should.equal('cellar door');
			content.parentElement.should.equal(domContext.container);
		});

		it('replaces previously rendered content if replace flag is set to true', function() {
			domContext.replace = true;
			renderer.render(domContext, nxt.Element('span', nxt.Text('before')));
			domContext.container.textContent.should.equal('before');
			renderer.render(nxt.Element('span', nxt.Text('after')));
			domContext.container.textContent.should.equal('after');
			domContext.replace = false;
			renderer.render(nxt.Element('span', nxt.Text('party')));
			domContext.container.textContent.should.equal('afterparty');
		});

		it('inserts an element node before another node if an insert reference has been set', function() {
			var movieNode = document.createElement('span');
			movieNode.textContent = 'Lethal Weapon II';
			domContext.container.appendChild(movieNode);
			domContext.insertReference = movieNode;
			renderer.render(domContext, nxt.Element('span', nxt.Text('Lethal Weapon I')));
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
});
