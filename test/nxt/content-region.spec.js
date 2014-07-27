describe('nxt.ContentRegion', function() {
	'use strict';

	var element;
	var domContext;
	var region;

	beforeEach(function () {
		element = document.createElement('div');
		domContext = { container: element };
		region = new nxt.ContentRegion(container);
	});

	describe('constructor', function() {
		it('creates a new content region based on a DOM context', function() {
			region.cells.should.be.an.instanceof(Array);
			region.cells.should.be.empty;
		});
	});

	describe('add', function() {
		it('binds and maps a content cell to a new cell in the cell collection', function() {
			var cell;
			for (var index = 0; index < 3; index++) {
				cell = new nx.Cell();
				region.add(cell);
			}
			region.cells.length.should.equal(3);
			var command = new nxt.Command('Node', 'render', nxt.Text('cellar door'));
			cell.value = command;
			region.cells[2].value.command.should.deep.equal(command);
		});

		it('assigns an index to the newly added cell', function () {

		});
	});

	describe('update', function () {
		it('runs cell\'s command', function () {
			var data = node: document.createElement('div');
			var command = new nxt.Command('Node', 'render', data);
			var domContext = {
				container: element,
				insertReference: null,
				content: null
			};
			var runSpy = sinon.spy(command, 'run');
			var cell = new nx.Cell({
				value: {
					index: 0,
					command: command,
					domContext: domContext,
					visible: false
				};
			});
			region.update(cell);
			runSpy.should.have.been.calledWith(data, domContext);
			element.childNodes.length.should.equal(1);
		});

		it('updates cell\'s DOM context with rendered content', function () {
			var data = node: document.createElement('div');
			var command = new nxt.Command('Node', 'render', data);
			var domContext = {
				container: element,
				insertReference: null,
				content: null
			};
			var cell = new nx.Cell({
				value: {
					index: 0,
					command: command,
					domContext: domContext,
					visible: false
				};
			});
			region.update(cell);
			cell.value.domContext.content.should.equal(data.node);
		});


		it('updates cell\'s visibility', function () {
			var data = node: document.createElement('div');
			var command = new nxt.Command('Node', 'render', data);
			var domContext = {
				container: element,
				insertReference: null,
				content: null
			};
			var cell = new nx.Cell({
				value: {
					index: 0,
					command: command,
					domContext: domContext,
					visible: false
				};
			});
			region.update(cell);
			cell.value.visible.should.equal(true);
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

	it('updates cells\' domContexts based on content and visibility changes of a certain element', function () {
		var converter = function(value) {
			if (value !== 'off') {
				return nxt.Text(value);
			}
		};

		var cells = [];
		for (var index = 0; index < 4; index++) {
			cells[index] = new nx.Cell({ value: 'off' });
			var commandCell = nxt.Binding(cells[index], converter);
			region.add(commandCell);
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
