describe('nxt.ContentRegion', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a new content region', function() {
			var container = document.createElement('div');
			var region = new nxt.ContentRegion(container);
			region.element.should.equal(container);
			region.items.should.be.an.instanceof(Array);
			region.items.should.be.empty;
		});
	});

	describe('add', function() {
		it('adds a dynamic element to the elements collection', function() {
			var label = new nx.Cell();
			var container = document.createElement('div');
			var region = new nxt.ContentRegion(container);
			var renderer;
			for (var index = 0; index < 3; index++) {
				renderer = new nxt.BindingRenderer(container);
				renderer.render(nxt.Binding(label, nxt.Text));
				region.add(renderer);
			}
			region.items.length.should.equal(3);
		});
	});

	describe('update', function () {
		it('updates items\' insertReferences based on visibility change of a certain element', function () {
			var cells = [];
			var container = document.createElement('div');
			var region = new nxt.ContentRegion(container);
			var converter = function(value) {
				if (value !== 'off') {
					return nxt.Text(value);
				}
			};
			for (var index = 0; index < 4; index++) {
				cells[index] = new nx.Cell({value: 'off'});
				var renderer = new nxt.BindingRenderer(container);
				renderer.render(nxt.Binding(cells[index], converter));
				region.add(renderer);
			}
			container.textContent.should.be.empty;
			cells[1].value = 'b';
			region.items[0].insertReference.should.equal(region.items[1].contentRenderer.content);
			should.not.exist(region.items[1].insertReference);
			container.textContent.should.equal('b');
			cells[3].value = 'd';
			region.items[0].insertReference.should.equal(region.items[1].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			should.not.exist(region.items[3].insertReference);
			container.textContent.should.equal('bd');
			cells[2].value = 'c';
			region.items[0].insertReference.should.equal(region.items[1].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[2].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			should.not.exist(region.items[3].insertReference);
			container.textContent.should.equal('bcd');
			cells[2].value = 'off';
			region.items[0].insertReference.should.equal(region.items[1].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			should.not.exist(region.items[3].insertReference);
			container.textContent.should.equal('bd');
			cells[1].value = 'off';
			region.items[0].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			should.not.exist(region.items[3].insertReference);
			container.textContent.should.equal('d');
			cells[3].value = 'off';
			should.not.exist(region.items[0].insertReference);
			should.not.exist(region.items[1].insertReference);
			should.not.exist(region.items[2].insertReference);
			should.not.exist(region.items[3].insertReference);
			container.textContent.should.be.empty;
			cells[3].value = 'd';
			region.items[0].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			should.not.exist(region.items[3].insertReference);
			container.textContent.should.equal('d');
			cells[0].value = 'a';
			region.items[0].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			should.not.exist(region.items[3].insertReference);
			container.textContent.should.equal('ad');
			cells[2].value = 'c';
			region.items[0].insertReference.should.equal(region.items[2].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[2].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			should.not.exist(region.items[3].insertReference);
			container.textContent.should.equal('acd');
		});
	});

	it('keeps track of items\' visibility and updates insert references so that items are rendered in the correct order', function () {
		var container = document.createElement('div');
		var region = new nxt.ContentRegion(container);
		var first = new nx.Cell();
		var second = new nx.Cell();
		var between = new nx.Cell();
		var renderer;
		var addRenderer = function(cell) {
			renderer = new nxt.BindingRenderer(container);
			renderer.render(nxt.Binding(cell, nxt.Text));
			region.add(renderer);
		};
		addRenderer(first);
		addRenderer(between);
		addRenderer(second);
		second.value = 'roll';
		container.childNodes.length.should.equal(1);
		container.textContent.should.equal('roll');
		first.value = 'rock';
		container.childNodes.length.should.equal(2);
		container.textContent.should.equal('rockroll');
		between.value = ' & ';
		container.childNodes.length.should.equal(3);
		container.textContent.should.equal('rock & roll');
	});

	it('keeps track of visibility of all dynamic items that have a `visible` cell', function () {
		var container = document.createElement('div');
		var region = new nxt.ContentRegion(container);
		var cell = new nx.Cell();
		var collection = new nx.Collection();
		var between = new nx.Cell();
		var renderer;
		var addRenderer = function(cell) {
			renderer = new nxt.BindingRenderer(container);
			renderer.render(nxt.Binding(cell, nxt.Text));
			region.add(renderer);
		};
		addRenderer(cell);
		addRenderer(between);
		renderer = new nxt.CollectionRenderer(container);
		renderer.render(nxt.Collection(collection, nxt.Text));
		region.add(renderer);
		collection.append('r','o','l','l');
		container.childNodes.length.should.equal(4);
		container.textContent.should.equal('roll');
		cell.value = 'rock';
		container.childNodes.length.should.equal(5);
		container.textContent.should.equal('rockroll');
		between.value = ' & ';
		container.childNodes.length.should.equal(6);
		container.textContent.should.equal('rock & roll');
	});

	it('uses an insert reference for prepending content instead of appending it to the element directly', function () {
		var container = document.createElement('div');
		var exclamationMark = document.createTextNode('!');
		container.appendChild(exclamationMark);
		var region = new nxt.ContentRegion(container);
		var first = new nx.Cell();
		var second = new nx.Cell();
		var between = new nx.Cell();
		var renderer;
		var addRenderer = function(cell) {
			renderer = new nxt.BindingRenderer(container);
			renderer.insertReference = exclamationMark;
			renderer.render(nxt.Binding(cell, nxt.Text));
			region.add(renderer);
		};
		addRenderer(first);
		addRenderer(between);
		addRenderer(second);
		region.insertReference = exclamationMark;
		second.value = 'roll';
		container.childNodes.length.should.equal(2);
		container.textContent.should.equal('roll!');
		first.value = 'rock';
		container.childNodes.length.should.equal(3);
		container.textContent.should.equal('rockroll!');
		between.value = ' & ';
		container.childNodes.length.should.equal(4);
		container.textContent.should.equal('rock & roll!');
	});
});
