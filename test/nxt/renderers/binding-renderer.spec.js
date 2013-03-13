describe('nxt.BindingRenderer', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a data binding renderer', function() {
			var element = document.createElement('div');
			var renderer = new nxt.BindingRenderer(element);
			renderer.element.should.equal(element);
		});
	});

	describe('property', function() {
		it('is an instance of nx.Property that is bound to the specified property', function () {
			var element = document.createElement('div');
			var renderer = new nxt.BindingRenderer(element);
			renderer.property.should.be.an.instanceof(nx.Property);
		});
	});

	describe('render', function() {
		it('creates a data binding with specified parameters and saves it in the `binding` property', function() {
			var element = document.createElement('div');
			var property = new nx.Property();
			var renderer = new nxt.BindingRenderer(element);
			renderer.render(
				nxt.Binding(property, function(value) { return nxt.Text(value); })
			);
			renderer.binding.should.be.an.instanceof(nx.Binding);
			renderer.binding.mode.should.equal('->');
		});
	});

	it('creates renderers based on content type received from the bound property', function() {
		var element = document.createElement('div');
		var property = new nx.Property();
		var renderer = new nxt.BindingRenderer(element);
		renderer.render(
			nxt.Binding(property, function(value) { return nxt.Text(value); })
		);
		property.value = 'cellar door';
		renderer.contentRenderer.should.be.an.instanceof(nxt.TextRenderer);
	});

	it('renders content received from the bound property into its containing element', function() {
		var element = document.createElement('div');
		var property = new nx.Property();
		var renderer = new nxt.BindingRenderer(element);
		renderer.render(
			nxt.Binding(property, function(value) { return nxt.Text(value); })
		);
		property.value = 'cellar door';
		element.textContent.should.equal('cellar door');
	});

	it('passes its insert reference to contentRenderer', function() {
		var element = document.createElement('div');
		var movieNode = document.createTextNode('Lethal Weapon II');
		element.appendChild(movieNode);
		var property = new nx.Property();
		var renderer = new nxt.BindingRenderer(element);
		renderer.insertReference = movieNode;
		renderer.render(
			nxt.Binding(property, function(value) { return nxt.Text(value); })
		);
		property.value = 'Lethal Weapon I';
		renderer.contentRenderer.insertReference.should.equal(renderer.insertReference);
		element.childNodes.length.should.equal(2);
		element.childNodes[0].textContent.should.equal('Lethal Weapon I');
		element.childNodes[0].nodeType.should.equal(Node.TEXT_NODE);
		element.childNodes[1].textContent.should.equal('Lethal Weapon II');
		element.childNodes[1].nodeType.should.equal(Node.TEXT_NODE);
	});
});
