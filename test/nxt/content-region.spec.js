describe('nxt.ContentRegion', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a new content region', function() {
			var container = document.createElement('div');
			var region = new nxt.ContentRegion(element);
			region.element.should.equal(container);
			region.items.should.be.an.instanceof(Array);
			region.items.should.be.empty();
		});
	});

	describe('add', function() {
		it('adds a dynamic element to the elements collection', function() {
			var label = new nx.Property();
			var container = document.createElement('div');
			var region = new nxt.ContentRegion(container);
			region.add(nxt.Binding(label, function(value) { return nxt.Text(value); }));
			region.add(nxt.Binding(label, function(value) { return nxt.Text(',' value); }));
			region.items.length.should.equal(2);
		});
	});

	it('keeps track of items\' visibility and updates insert references so that items are rendered in the correct order', function () {\
		var container = document.createElement('div');
		var region = new nxt.ContentRegion(container);
		var first = new nx.Property();
		var second = new nx.Property();
		var between = new nx.Property();
		region.add(nxt.Binding(first, function(value) { return nxt.Text(value); }));
		region.add(nxt.Binding(between, function(value) { return nxt.Text(value); }));
		region.add(nxt.Binding(second, function(value) { return nxt.Text(value); }));
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

	it('uses an insert reference for prepending content instead of appending it to the element directly', function () {\
		var container = document.createElement('div');
		var exclamationMark = document.createTextNode('!');
		container.appendChild(exclamationMark);
		var region = new nxt.ContentRegion(container);
		var first = new nx.Property();
		var second = new nx.Property();
		var between = new nx.Property();
		region.add(nxt.Binding(first, function(value) { return nxt.Text(value); }));
		region.add(nxt.Binding(between, function(value) { return nxt.Text(value); }));
		region.add(nxt.Binding(second, function(value) { return nxt.Text(value); }));
		region.insertReference = exclamationMark;
		second.value = 'roll';
		container.childNodes.length.should.equal(1);
		container.textContent.should.equal('roll!');
		first.value = 'rock';
		container.childNodes.length.should.equal(2);
		container.textContent.should.equal('rockroll!');
		between.value = ' & ';
		container.childNodes.length.should.equal(3);
		container.textContent.should.equal('rock & roll!');
	});
});
