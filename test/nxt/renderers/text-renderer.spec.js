describe('nxt.TextRenderer', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a text node rendering instance by its string value', function() {
			var renderer = new nxt.TextRenderer('cellar door');
			renderer.text.should.equal('cellar door');
		});

		it('has \'text\' type', function() {
			var renderer = new nxt.TextRenderer('cellar door');
			renderer.type.should.equal('text');
		});
	});

	describe('render', function() {
		it('appends a text node to an element if there is no insert reference and no previously rendered content', function() {
			var element = document.createElement('span');
			var renderer = new nxt.TextRenderer('cellar door');
			renderer.render(element);
			element.childNodes.length.should.equal(1);
			element.textContent.should.equal('cellar door');
		});

		it('returns created text node', function() {
			var element = document.createElement('span');
			var renderer = new nxt.TextRenderer('cellar door');
			var content = renderer.render(element);
			content.nodeType.should.equal(Node.TEXT_NODE);
			content.nodeValue.should.equal('cellar door');
			content.parentElement.should.equal(element);
		});

		it('stores rendered content reference in the `content` property', function() {
			var element = document.createElement('span');
			var renderer = new nxt.TextRenderer('cellar door');
			var content = renderer.render(element);
			renderer.content.should.equal(content);
		});

		it('replaces previously rendered content', function() {
			var element = document.createElement('span');
			var renderer = new nxt.TextRenderer('before');
			var content = renderer.render(element);
			element.textContent.should.equal('before');
			renderer.text = 'after';
			renderer.render(element);
			element.textContent.should.equal('after');
		});

		it('inserts a text node before another node if an insert reference has been set', function() {
			var element = document.createElement('span');
			var movieNode = document.createTextNode('Lethal Weapon II');
			element.appendChild(movieNode);
			var renderer = new nxt.TextRenderer('Lethal Weapon I');
			renderer.insertReference = movieNode;
			renderer.render(element);
			element.childNodes.length.should.equal(2);
			element.childNodes[0].nodeValue.should.equal('Lethal Weapon I');
			element.childNodes[1].nodeValue.should.equal('Lethal Weapon II');
		});
	});
});