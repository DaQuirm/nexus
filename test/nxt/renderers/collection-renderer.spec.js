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

	describe('visible', function () {
		it('is an nx.Property that indicates whether collection has any content items', function () {
			var element = document.createElement('div');
			var collection = new nx.Collection();
			var renderer = new nxt.CollectionRenderer(element);
			renderer.visible.should.be.an.instanceof(nx.Property);
			renderer.render(
				nxt.Collection(collection, nxt.Text)
			);
			collection.append('cellar door');
			renderer.visible.value.should.equal(true);
			collection.removeAll();
			renderer.visible.value.should.equal(false);
		});
	});

	describe('render', function() {
		it('adds handlers to collection events', function() {
			var element = document.createElement('div');
			var collection = new nx.Collection();
			var renderer = new nxt.CollectionRenderer(element);
			renderer.render(
				nxt.Collection(collection, nxt.Text)
			);
			Object.keys(collection.onappend.handlers).length.should.equal(1);
			Object.keys(collection.oninsertbefore.handlers).length.should.equal(1);
			Object.keys(collection.onreset.handlers).length.should.equal(1);
		});

		it('appends all collection items to the element', function () {
			var container = document.createElement('div');
			var collection = new nx.Collection({items: ['a','b','c']});
			var renderer = new nxt.CollectionRenderer(container);
			renderer.render(
				nxt.Collection(collection, nxt.Text)
			);
			container.childNodes.length.should.equal(3);
			container.firstChild.textContent.should.equal('a');
			container.lastChild.textContent.should.equal('c');
		});
	});

	describe('append', function () {
		it('appends rendered content to the element', function () {
			var container = document.createElement('ul');
			var collection = new nx.Collection();
			var renderer = new nxt.CollectionRenderer(container);
			renderer.render(
				nxt.Collection(collection, function(value) {
					return nxt.Element('li', nxt.Text(value));
				})
			);
			renderer.append({items:['a','b']});
			renderer.append({items:['cellar door']});
			container.childNodes.length.should.equal(3);
			container.lastChild.nodeName.toLowerCase().should.equal('li');
			container.lastChild.textContent.should.equal('cellar door');
		});
	});

	describe('remove', function () {
		it('removes content items from the element', function () {
			var container = document.createElement('ul');
			var collection = new nx.Collection();
			var renderer = new nxt.CollectionRenderer(container);
			renderer.render(
				nxt.Collection(collection, function(value) {
					return nxt.Element('li', nxt.Text(value));
				})
			);
			renderer.append({items:['a', 'b', 'c']});
			container.childNodes.length.should.equal(3);
			renderer.remove({items:['b'], indexes:[1]});
			container.childNodes.length.should.equal(2);
			container.firstChild.textContent.should.equal('a');
			container.lastChild.textContent.should.equal('c');
		});
	});

	describe('insertBefore', function () {
		it('inserts an item before an existing item inside the element', function () {
			var container = document.createElement('ul');
			var collection = new nx.Collection();
			var renderer = new nxt.CollectionRenderer(container);
			renderer.render(
				nxt.Collection(collection, function(value) {
					return nxt.Element('li', nxt.Text(value));
				})
			);
			renderer.append({items:['a', 'c']});
			renderer.insertBefore({items: ['b'], index: 1});
			container.childNodes.length.should.equal(3);
			container.firstChild.textContent.should.equal('a');
			container.childNodes[1].textContent.should.equal('b');
		});
	});

	describe('reset', function () {
		it('removes all content items from the element and renders new items', function () {
			var container = document.createElement('ul');
			var collection = new nx.Collection();
			var renderer = new nxt.CollectionRenderer(container);
			renderer.render(
				nxt.Collection(collection, function(value) {
					return nxt.Element('li', nxt.Text(value));
				})
			);
			renderer.append({items: ['a','b','c']});
			renderer.reset({items: ['d','e','f']});
			container.childNodes.length.should.equal(3);
			container.firstChild.textContent.should.equal('d');
			container.childNodes[1].textContent.should.equal('e');
			container.lastChild.textContent.should.equal('f');
		});
	});

	describe('contentReference', function () {
		it('points to rendered content', function () {
			var container = document.createElement('ul');
			var collection = new nx.Collection();
			var renderer = new nxt.CollectionRenderer(container);
			renderer.render(
				nxt.Collection(collection, function(value) {
					return nxt.Element('li', nxt.Text(value));
				})
			);
			renderer.append({items: ['a','b','c']});
			renderer.contentReference.nodeName.toLowerCase().should.equal('li');
			renderer.contentReference.textContent.should.equal('a');
		});
	});
});
