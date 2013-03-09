describe('nxt.AttrRenderer', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a DOM atribute rendering instance by attribute name and value', function() {
			var renderer = new nxt.AttrRenderer('class', 'large-text');
			renderer.name.should.equal('class');
			renderer.value.should.equal('large-text');
		});
	});

	describe('render', function() {
		it('sets an attribute of a DOM element', function() {
			var link = document.createElement('a');
			var renderer = new nxt.AttrRenderer('class', 'large-text');
			renderer.render(link);
			link.getAttribute('class').should.equal('large-text');
		});

		it('stores link to the attribute node created');
	});
});
