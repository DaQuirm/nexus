describe('nxt.BindingRenderer', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a data binding renderer', function() {
			var element = document.createElement('div');
			var renderer = new nxt.BindingRenderer(element);
			renderer.element.should.equal(element);
		});
	});

	describe('cell', function() {
		it('is an instance of nx.Cell that is bound to the specified cell', function () {
			var element = document.createElement('div');
			var renderer = new nxt.BindingRenderer(element);
			renderer.cell.should.be.an.instanceof(nx.Cell);
		});
	});

	describe('visible', function () {
		it('is an nx.Cell that indicates whether binding has rendered some content', function () {
			var element = document.createElement('div');
			var cell = new nx.Cell();
			var renderer = new nxt.BindingRenderer(element);
			renderer.visible.should.be.an.instanceof(nx.Cell);
			renderer.render(
				nxt.Binding(cell, function(value) {
					if (value > 0) {
						return nxt.Text(value);
					}
				})
			);
			cell.value = 1;
			renderer.visible.value.should.equal(true);
			cell.value = -1;
			renderer.visible.value.should.equal(false);
		});
	});

	describe('render', function() {
		it('creates a data binding with specified parameters and saves it in the `binding` cell', function() {
			var element = document.createElement('div');
			var cell = new nx.Cell();
			var renderer = new nxt.BindingRenderer(element);
			renderer.render(
				nxt.Binding(cell, function(value) { return nxt.Text(value); })
			);
			renderer.binding.should.be.an.instanceof(nx.Binding);
			renderer.binding.mode.should.equal('->');
		});
	});

	describe('content', function () {
		it('points to rendered content', function () {
			var element = document.createElement('div');
			var cell = new nx.Cell();
			var renderer = new nxt.BindingRenderer(element);
			renderer.render(
				nxt.Binding(cell, function(value) { return nxt.Text(value); })
			);
			cell.value = 'cellar door';
			renderer.content.should.equal(renderer.contentRenderer.content);
		});
	});

	it('creates renderers based on content type received from the bound cell', function() {
		var element = document.createElement('div');
		var cell = new nx.Cell();
		var renderer = new nxt.BindingRenderer(element);
		renderer.render(
			nxt.Binding(cell, function(value) { return nxt.Text(value); })
		);
		cell.value = 'cellar door';
		renderer.contentRenderer.should.be.an.instanceof(nxt.NodeRenderer);
	});

	it('renders content received from the bound cell into its containing element', function() {
		var element = document.createElement('div');
		var cell = new nx.Cell();
		var renderer = new nxt.BindingRenderer(element);
		renderer.render(
			nxt.Binding(cell, function(value) { return nxt.Text(value); })
		);
		cell.value = 'cellar door';
		element.textContent.should.equal('cellar door');
	});

	it('passes its insert reference to contentRenderer', function() {
		var element = document.createElement('div');
		var movieNode = document.createTextNode('Lethal Weapon II');
		element.appendChild(movieNode);
		var cell = new nx.Cell();
		var renderer = new nxt.BindingRenderer(element);
		renderer.insertReference = movieNode;
		renderer.render(
			nxt.Binding(cell, function(value) { return nxt.Text(value); })
		);
		cell.value = 'Lethal Weapon I';
		renderer.contentRenderer.insertReference.should.equal(renderer.insertReference);
		element.childNodes.length.should.equal(2);
		element.childNodes[0].textContent.should.equal('Lethal Weapon I');
		element.childNodes[0].nodeType.should.equal(Node.TEXT_NODE);
		element.childNodes[1].textContent.should.equal('Lethal Weapon II');
		element.childNodes[1].nodeType.should.equal(Node.TEXT_NODE);
	});

	it('doesn\'t fail on undefined values', function () {
		var element = document.createElement('div');
		var cell = new nx.Cell();
		var renderer = new nxt.BindingRenderer(element);
		renderer.render(
			nxt.Binding(cell, function(value) { })
		);
		cell.value = 'cellar door';
		element.textContent.should.be.empty;
	});
});
