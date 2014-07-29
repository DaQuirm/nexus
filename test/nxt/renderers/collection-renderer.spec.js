describe('nxt.CollectionRenderer', function() {
	'use strict';

	var domContext;
	var renderer;
	var container;
	var conversion = conversion = function(item) {
		return nxt.Element('li',
			nxt.Element('span',
				nxt.Text(item)
			)
		);
	};

	beforeEach(function() {
		container = document.createElement('ul');
		domContext = { container: container };
		renderer = new nxt.CollectionRenderer();
	});

	describe('render', function() {
		it('appends all collection items to the element', function () {
			var container = document.createElement('div');
			var collection = new nx.Collection({ items: ['a','b','c'] });
			var renderer = new nxt.CollectionRenderer(container);
			renderer.render(
				nxt.Collection(collection, nxt.Text)
			);
			container.childNodes.length.should.equal(3);
			container.firstChild.textContent.should.equal('a');
			container.lastChild.textContent.should.equal('c');
		});

		it('doesn\'t call append if there are no items to append', function () {
			var container = document.createElement('div');
			var collection = new nx.Collection({ items: ['a','b','c'] });
			var p = new nx.Cell();
			collection.bind(p, '<->');
			p.value = undefined;
			var renderer = new nxt.CollectionRenderer(container);
			renderer.render(
				nxt.Collection(collection, nxt.Text)
			);
			container.childNodes.length.should.equal(0);
		});

		it('attaches delegated event handlers if there are any', function(done) {
			document.body.appendChild(container);
			var collection = new nx.Collection({ items: ['a','b','c'] });
			var renderer = new nxt.CollectionRenderer(container);
			renderer.render(
				nxt.Collection(collection, function(item) {
						return nxt.Element('li',
							nxt.Element('span',
								nxt.Text(item)
							)
						)
					},
					nxt.DelegatedEvent('click', {
						'span': function(evt, item) {
							item.should.equal('c');
							document.body.removeChild(container);
							done();
						}
					})
				)
			);
			container.childNodes[2].childNodes[0].click();
		});
	});

	describe('visible', function () {
		it('returns true for non-empty collection content', function () {
			renderer.visible([]).should.equal(false);
			renderer.visible([1,2,3]).should.equal(true);
		});
	});

	describe('append', function () {
		it('appends rendered content to the element', function () {
			renderer.append({ items:['a','b'].map(conversion) }, domContext);
			renderer.append({ items:['cellar door'].map(conversion) }, domContext);
			container.childNodes.length.should.equal(3);
			container.lastChild.nodeName.toLowerCase().should.equal('li');
			container.lastChild.textContent.should.equal('cellar door');
		});
	});

	describe('remove', function () {
		it('removes content items from the element', function () {
			domContext.content = renderer.append({ items:['a', 'b', 'c'].map(conversion) }, domContext);
			container.childNodes.length.should.equal(3);
			var content = renderer.remove({ items:['b'].map(conversion), indexes:[1]}, domContext);
			container.childNodes.length.should.equal(2);
			container.firstChild.textContent.should.equal('a');
			container.lastChild.textContent.should.equal('c');
			content[0].should.deep.equal(container.firstChild);
			content[1].should.deep.equal(container.lastChild);
		});
	});

	describe('insertBefore', function () {
		it('inserts an item before an existing item inside the element', function () {
			domContext.content = renderer.append({ items:['a', 'c'].map(conversion) }, domContext);
			renderer.insertBefore({ items: ['b'].map(conversion), index: 1 }, domContext);
			container.childNodes.length.should.equal(3);
			container.firstChild.textContent.should.equal('a');
			container.childNodes[1].textContent.should.equal('b');
		});
	});

	describe('reset', function () {
		it('removes all content items from the element and renders new items', function () {
			renderer.append({ items: ['a','b','c'].map(conversion) }, domContext);
			renderer.reset({ items: ['d','e','f'].map(conversion) }, domContext);
			container.childNodes.length.should.equal(3);
			container.firstChild.textContent.should.equal('d');
			container.childNodes[1].textContent.should.equal('e');
			container.lastChild.textContent.should.equal('f');
		});
	});

	it('doesn\'t remove all element\'s child nodes when all collection items are removed', function () {
		var container = document.createElement('ul');
		var listItem = document.createElement('li');
		listItem.textContent = 'a';
		container.appendChild(listItem);
		var collection = new nx.Collection();
		var renderer = new nxt.CollectionRenderer(container);
		renderer.render(
			nxt.Collection(collection, function(value) {
				return nxt.Element('li', nxt.Text(value));
			})
		);
		renderer.append({items: ['b','c','d']});
		container.textContent.should.equal('abcd');
		renderer.reset({items:[]});
		container.textContent.should.equal('a');
		container.childNodes.length.should.equal(1);
	});
});
