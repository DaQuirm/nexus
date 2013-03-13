describe('nxt.AttrRenderer', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a DOM atribute rendering instance by attribute name and value', function() {
			var element = document.createElement('a');
			var renderer = new nxt.AttrRenderer(element);
			renderer.element.should.equal(element);
		});
	});

	describe('render', function() {
		it('sets an attribute of a DOM element', function() {
			var link = document.createElement('a');
			var renderer = new nxt.AttrRenderer(link);
			renderer.render(nxt.Attr('class', 'large-text'));
			link.getAttribute('class').should.equal('large-text');
		});
	});
});
