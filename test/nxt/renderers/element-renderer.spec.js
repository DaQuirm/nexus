describe('nxt.ElementRenderer', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a node rendering instance for a container element', function() {
			var element = document.createElement('div');
			var renderer = new nxt.ElementRenderer(element);
			renderer.element.should.equal(element);
		});

		it('replaces previously rendered content by default', function() {
			var element = document.createElement('div');
			var renderer = new nxt.ElementRenderer(element);
			renderer.replace.should.equal(true);
		});
	});

	describe('render', function() {
		it('appends an element to the container if there is no insert reference and replace is `false`', function() {
			var element = document.createElement('div');
			var renderer = new nxt.ElementRenderer(element);
			renderer.render(nxt.Element('span', nxt.Text('cellar door')));
			element.childNodes.length.should.equal(1);
			element.textContent.should.equal('cellar door');
		});

		it('returns created element node', function() {
			var element = document.createElement('div');
			var renderer = new nxt.ElementRenderer(element);
			var content = renderer.render(new nxt.Element('span', new nxt.Text('cellar door')));
			content.nodeType.should.equal(Node.ELEMENT_NODE);
			content.nodeName.should.equal('span');
			content.textContent.should.equal('cellar door');
			content.parentElement.should.equal(element);
		});

		it('stores rendered content reference in the `content` property', function() {
			var element = document.createElement('div');
			var renderer = new nxt.ElementRenderer(element);
			var content = renderer.render(nxt.Element('span', nxt.Text('cellar door')));
			renderer.content.should.equal(content);
		});

		it('replaces previously rendered content if `replace` is true', function() {
			var element = document.createElement('div');
			var renderer = new nxt.ElementRenderer(element);
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
			var renderer = new nxt.ElementRenderer(element);
			renderer.insertReference = movieNode;
			renderer.render(nxt.Element('span', nxt.Text('Lethal Weapon I')));
			element.childNodes.length.should.equal(2);
			element.childNodes[0].textContent.should.equal('Lethal Weapon I');
			element.childNodes[0].nodeName.should.equal('span');
			element.childNodes[1].textContent.should.equal('Lethal Weapon II');
			element.childNodes[1].nodeName.should.equal('span');
		});
	});
});
