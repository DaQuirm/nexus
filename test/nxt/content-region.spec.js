describe('nxt.ContentRegion', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a new content region', function() {

		});
	});

	describe('add', function() {
		it('adds a dynamic element to the elements collection', function() {
			var region = new nxt.ContentRegion();
			var label = new nx.Property();
			label.value = 'cellar door';
			var bindingRenderer = new nxt.BindingRenderer(label, function(value) { return new nxt.Text(value); });
		});

		it('stores link to the attribute node created');
	});
});
