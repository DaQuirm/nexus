describe('nxt.TextRenderer', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a text node rendering instance for an element', function() {
			var element = document.createElement('div');
			var renderer = new nxt.TextRenderer(element);
			renderer.element.should.equal(element);
		});

		it('has \'Text\' type', function() {
			var element = document.createElement('div');
			var renderer = new nxt.TextRenderer(element);
			renderer.type.should.equal('Text');
		});
	});

	describe('render', function() {
		it('appends a text node to an element if there is no insert reference and no previously rendered content', function() {
			var element = document.createElement('span');
			var renderer = new nxt.TextRenderer(element);
			renderer.render(nxt.Text('cellar door'));
			element.childNodes.length.should.equal(1);
			element.textContent.should.equal('cellar door');
		});

		it('returns created text node', function() {
			var element = document.createElement('span');
			var renderer = new nxt.TextRenderer(element);
			var content = renderer.render(new nxt.Text('cellar door'));
			content.nodeType.should.equal(Node.TEXT_NODE);
			content.nodeValue.should.equal('cellar door');
			content.parentElement.should.equal(element);
		});

		it('stores rendered content reference in the `content` property', function() {
			var element = document.createElement('span');
			var renderer = new nxt.TextRenderer(element);
			var content = renderer.render(nxt.Text('cellar door'));
			renderer.content.should.equal(content);
		});

		it('replaces previously rendered content', function() {
			var element = document.createElement('span');
			var renderer = new nxt.TextRenderer(element);
			renderer.render(nxt.Text('before'));
			element.textContent.should.equal('before');
			renderer.render(nxt.Text('after'));
			element.textContent.should.equal('after');
		});

		it('inserts a text node before another node if an insert reference has been set', function() {
			var element = document.createElement('span');
			var movieNode = document.createTextNode('Lethal Weapon II');
			element.appendChild(movieNode);
			var renderer = new nxt.TextRenderer(element);
			renderer.insertReference = movieNode;
			renderer.render(nxt.Text('Lethal Weapon I'));
			element.childNodes.length.should.equal(2);
			element.childNodes[0].nodeValue.should.equal('Lethal Weapon I');
			element.childNodes[1].nodeValue.should.equal('Lethal Weapon II');
		});
	});
});
