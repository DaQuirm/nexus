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
			domContext.content = renderer.append({ items: ['a','b','c'].map(conversion) }, domContext);
			renderer.reset({ items: ['d','e','f'].map(conversion) }, domContext);
			container.childNodes.length.should.equal(3);
			container.firstChild.textContent.should.equal('d');
			container.childNodes[1].textContent.should.equal('e');
			container.lastChild.textContent.should.equal('f');
		});

		it('doesn\'t remove all element\'s child nodes when all collection items are removed', function () {
			var container = document.createElement('ul');
			var listItem = document.createElement('li');
			listItem.textContent = 'a';
			container.appendChild(listItem);
			var conversion = function(value) {
				return nxt.Element('li', nxt.Text(value));
			};
			var renderer = new nxt.CollectionRenderer();
			domContext.container = container;
			domContext.content = renderer.append({ items: ['b','c','d'].map(conversion) }, domContext);
			container.textContent.should.equal('abcd');
			renderer.reset({ items:[] }, domContext);
			container.textContent.should.equal('a');
			container.childNodes.length.should.equal(1);
		});
	});
});
