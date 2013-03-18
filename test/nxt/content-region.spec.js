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
			var label = new nx.Property();
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
			var properties = [];
			var container = document.createElement('div');
			var region = new nxt.ContentRegion(container);
			var converter = function(value) {
				if (value !== 'off') {
					return nxt.Text(value);
				}
			};
			for (var index = 0; index < 4; index++) {
				properties[index] = new nx.Property({value: 'off'});
				var renderer = new nxt.BindingRenderer(container);
				renderer.render(nxt.Binding(properties[index], converter));
				region.add(nxt.Binding(properties[index], converter));
			}
			container.textContent.should.be.empty;
			properties[1].value = 'b';
			region.items[0].insertReference.should.equal(region.items[1].contentRenderer.content);
			region.items[1].insertReference.should.be.empty;
			container.textContent.should.equal('b');
			properties[3].value = 'd';
			region.items[0].insertReference.should.equal(region.items[1].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[3].insertReference.should.be.empty;
			container.textContent.should.equal('bd');
			properties[2].value = 'c';
			region.items[0].insertReference.should.equal(region.items[1].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[2].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[3].insertReference.should.be.empty;
			container.textContent.should.equal('bcd');
			properties[2].value = 'off';
			region.items[0].insertReference.should.equal(region.items[1].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[3].insertReference.should.be.empty;
			container.textContent.should.equal('bd');
			properties[1].value = 'off';
			region.items[0].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[3].insertReference.should.be.empty;
			container.textContent.should.equal('d');
			properties[3].value = 'off';
			region.items[0].insertReference.should.be.empty;
			region.items[1].insertReference.should.be.empty;
			region.items[2].insertReference.should.be.empty;
			region.items[3].insertReference.should.be.empty;
			container.textContent.should.be.empty;
			properties[3].value = 'd';
			region.items[0].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[3].insertReference.should.be.empty;
			container.textContent.should.equal('d');
			properties[0].value = 'a';
			region.items[0].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[3].insertReference.should.be.empty;
			container.textContent.should.equal('ad');
			properties[2].value = 'c';
			region.items[0].insertReference.should.equal(region.items[2].contentRenderer.content);
			region.items[1].insertReference.should.equal(region.items[2].contentRenderer.content);
			region.items[2].insertReference.should.equal(region.items[3].contentRenderer.content);
			region.items[3].insertReference.should.be.empty;
			container.textContent.should.equal('acd');
		});
	});

	it('keeps track of items\' visibility and updates insert references so that items are rendered in the correct order', function () {
		var container = document.createElement('div');
		var region = new nxt.ContentRegion(container);
		var properties = {};
		properties.first = new nx.Property();
		properties.second = new nx.Property();
		properties.between = new nx.Property();
		var renderer;
		for (var index in properties) {
			renderer = new nxt.BindingRenderer(container);
			renderer.render(nxt.Binding(properties[index], nxt.Text));
			region.add(renderer);
		}
		properties.second.value = 'roll';
		container.childNodes.length.should.equal(1);
		container.textContent.should.equal('roll');
		properties.first.value = 'rock';
		container.childNodes.length.should.equal(2);
		container.textContent.should.equal('rockroll');
		properties.between.value = ' & ';
		container.childNodes.length.should.equal(3);
		container.textContent.should.equal('rock & roll');
	});

	it('uses an insert reference for prepending content instead of appending it to the element directly', function () {
		var container = document.createElement('div');
		var exclamationMark = document.createTextNode('!');
		container.appendChild(exclamationMark);
		var region = new nxt.ContentRegion(container);
		var properties = {};
		properties.first = new nx.Property();
		properties.second = new nx.Property();
		properties.between = new nx.Property();
		var renderer;
		for (var index in properties) {
			renderer = new nxt.BindingRenderer(container);
			renderer.render(nxt.Binding(properties[index], nxt.Text));
			region.add(renderer);
		}
		region.insertReference = exclamationMark;
		properties.second.value = 'roll';
		container.childNodes.length.should.equal(1);
		container.textContent.should.equal('roll!');
		properties.first.value = 'rock';
		container.childNodes.length.should.equal(2);
		container.textContent.should.equal('rockroll!');
		properties.between.value = ' & ';
		container.childNodes.length.should.equal(3);
		container.textContent.should.equal('rock & roll!');
	});
});
