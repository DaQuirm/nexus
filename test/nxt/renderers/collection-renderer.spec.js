describe('nxt.CollectionRenderer', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a collection renderer', function() {
			var element = document.createElement('div');
			var renderer = new nxt.CollectionRenderer(element);
			renderer.element.should.equal(element);
		});
	});

	describe('collection', function() {
		it('is an instance of nx.Collection that the renderer observes', function () {
			var element = document.createElement('div');
			var collection = new nx.Collection();
			var renderer = new nxt.CollectionRenderer(element);
			renderer.render(nxt.Collection(collection, nxt.Text));
			renderer.collection.should.equal(collection);
		});
	});

	describe('render', function() {
		it('adds handlers to collection events', function() {
			var element = document.createElement('div');
			var collection = new nx.Collection();
			var renderer = new nxt.CollectionRenderer(element);
			renderer.render(
				nxt.Collection(property, nxt.Text)
			);
			Object.keys(collection.onappend.handlers).length.should.equal(1);
			Object.keys(collection.oninsertbefore.handlers).length.should.equal(1);
			Object.keys(collection.onreset.handlers).length.should.equal(1);
		});
	});

	describe('append', function () {
		it('appends rendered content to the element', function () {
			var container = document.createElement('ul');
			var collection = new nx.Collection({items: ['a','b']});
			var renderer = new nxt.CollectionRenderer(container);
			renderer.render(
				nxt.Collection(collection, function(value) {
					return nxt.Element('li', nxt.Text(value));
				})
			);
			renderer.append(collection.contentRenderer.render(nxt.Element('li', nxt.Text('cellar door'))));
			container.childNodes.length.should.equal(3);
			container.lastChild.nodeType.should.equal(Node.TEXT_NODE);
			container.lastChild.nodeValue.should.equal('cellar door');
		});
	});

	describe('remove', function () {
		it('removes content items from the element', function () {
			var container = document.createElement('ul');
			var collection = new nx.Collection({items: ['a','b','c']});
			var renderer = new nxt.CollectionRenderer(container);
			renderer.render(
				nxt.Collection(collection, function(value) {
					return nxt.Element('li', nxt.Text(value));
				})
			);
			container.childNodes.length.should.equal(3);
			renderer.remove();
			container.childNodes.length.should.equal(2);
			container.firstChild.nodeValue.should.equal('a');
			container.lastChild.nodeValue.should.equal('b');
		});
	});

	describe('insertBefore', function () {
		it('inserts an item before an existing item inside the element', function () {
			var container = document.createElement('ul');
			var collection = new nx.Collection({items: ['a', 'c']});
			var renderer = new nxt.CollectionRenderer(container);
			renderer.render(
				nxt.Collection(collection, function(value) {
					return nxt.Element('li', nxt.Text(value));
				})
			);
			container.childNodes.length.should.equal(2);
			collection.remove('b');
			container.childNodes.length.should.equal(2);
			container.firstChild.nodeValue.should.equal('a');
			container.lastChild.nodeValue.should.equal('b');
		});
	});

	it('creates renderers based on content type received from the bound property', function() {
		var element = document.createElement('div');
		var collection = new nx.Collection();
		var renderer = new nxt.CollectionRenderer(element);
		renderer.render(
			nxt.Collection(collection, nxt.Text)
		);
		collection.append('cellar door');
		renderer.contentRenderer.should.be.an.instanceof(nxt.TextRenderer);
	});

	it('passes its insert reference to contentRenderer', function() {
		var element = document.createElement('div');
		var movieNode = document.createTextNode('Lethal Weapon IV');
		element.appendChild(movieNode);
		var collection = new nx.Collection();
		var renderer = new nxt.CollectionRenderer(element);
		renderer.insertReference = movieNode;
		renderer.render(
			nxt.Collection(collection, nxt.Text)
		);
		collection.append('Lethal Weapon I', 'Lethal Weapon II', 'Lethal Weapon III');
		renderer.contentRenderer.insertReference.should.equal(renderer.insertReference);
		element.childNodes.length.should.equal(4);
		element.childNodes[0].textContent.should.equal('Lethal Weapon I');
		element.childNodes[0].nodeType.should.equal(Node.TEXT_NODE);
		element.childNodes[1].textContent.should.equal('Lethal Weapon II');
		element.childNodes[1].nodeType.should.equal(Node.TEXT_NODE);
		element.childNodes[2].textContent.should.equal('Lethal Weapon III');
		element.childNodes[2].nodeType.should.equal(Node.TEXT_NODE);
		element.childNodes[3].textContent.should.equal('Lethal Weapon IV');
		element.childNodes[3].nodeType.should.equal(Node.TEXT_NODE);
	});
});
