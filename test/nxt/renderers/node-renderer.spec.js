describe('nxt.NodeRenderer', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a node rendering instance for a container element', function() {
			var element = document.createElement('div');
			var renderer = new nxt.NodeRenderer(element);
			renderer.element.should.equal(element);
		});

		it('replaces previously rendered content by default', function() {
			var element = document.createElement('div');
			var renderer = new nxt.NodeRenderer(element);
			renderer.replace.should.equal(true);
		});
	});

	describe('render', function() {
		it('appends an element to the container if there is no insert reference and replace is `false`', function() {
			var element = document.createElement('div');
			var renderer = new nxt.NodeRenderer(element);
			renderer.render(nxt.Element('span', nxt.Text('cellar door')));
			element.childNodes.length.should.equal(1);
			element.textContent.should.equal('cellar door');
		});

		it('appends a text node to an element if there is no insert reference and `replace` is false', function() {
			var element = document.createElement('span');
			var renderer = new nxt.NodeRenderer(element);
			renderer.render(nxt.Text('cellar door'));
			element.childNodes.length.should.equal(1);
			element.textContent.should.equal('cellar door');
		});

		it('returns created node', function() {
			var element = document.createElement('div');
			var renderer = new nxt.NodeRenderer(element);
			var content = renderer.render(new nxt.Element('span', new nxt.Text('cellar door')));
			content.nodeType.should.equal(Node.ELEMENT_NODE);
			content.nodeName.toLowerCase().should.equal('span');
			content.textContent.should.equal('cellar door');
			content.parentElement.should.equal(element);
		});

		it('stores rendered content reference in the `content` property', function() {
			var element = document.createElement('div');
			var renderer = new nxt.NodeRenderer(element);
			var content = renderer.render(nxt.Element('span', nxt.Text('cellar door')));
			renderer.content.should.equal(content);
		});

		it('replaces previously rendered content if `replace` is true', function() {
			var element = document.createElement('div');
			var renderer = new nxt.NodeRenderer(element);
			renderer.render(nxt.Element('span', nxt.Text('before')));
			element.textContent.should.equal('before');
			renderer.render(nxt.Element('span', nxt.Text('after')));
			element.textContent.should.equal('after');
			renderer.replace = false;
			renderer.render(nxt.Element('span', nxt.Text('party')));
			element.textContent.should.equal('afterparty');
		});

		it('inserts an element node before another node if an insert reference has been set', function() {
			var element = document.createElement('div');
			var movieNode = document.createElement('span');
			movieNode.textContent = 'Lethal Weapon II';
			element.appendChild(movieNode);
			var renderer = new nxt.NodeRenderer(element);
			renderer.insertReference = movieNode;
			renderer.render(nxt.Element('span', nxt.Text('Lethal Weapon I')));
			element.childNodes.length.should.equal(2);
			element.childNodes[0].textContent.should.equal('Lethal Weapon I');
			element.childNodes[0].nodeName.toLowerCase().should.equal('span');
			element.childNodes[1].textContent.should.equal('Lethal Weapon II');
			element.childNodes[1].nodeName.toLowerCase().should.equal('span');
		});

		it('clears rendered content when called with undefined or no parameters', function(){
			var element = document.createElement('div');
			var renderer = new nxt.NodeRenderer(element);
			renderer.render(nxt.Element('span', nxt.Text('cellar door')));
			element.childNodes.length.should.equal(1);
			element.textContent.should.equal('cellar door');
			renderer.render();
			should.not.exist(renderer.content);
			element.childNodes.length.should.equal(0);
			element.textContent.should.be.empty;
		});
	});
});
