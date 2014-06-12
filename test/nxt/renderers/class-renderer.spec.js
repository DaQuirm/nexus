describe('nxt.ClassRenderer', function() {
	'use strict';

	describe('constructor', function() {
		it('creates CSS class rendering instance', function() {
			var element = document.createElement('a');
			var renderer = new nxt.ClassRenderer(element);
			renderer.element.should.equal(element);
		});
	});

	describe('render', function() {
		it('adds a class to the element\'s class list if the `set` field is true', function() {
			var link = document.createElement('a');
			link.classList.add('epic-link');
			var renderer = new nxt.ClassRenderer(link);
			renderer.render(nxt.Class('large-text', true));
			link.classList.contains('epic-link').should.equal(true);
			link.classList.contains('large-text').should.equal(true);
		});

		it('removes a class from the element\'s class list if the `set` field is false', function() {
			var link = document.createElement('a');
			link.classList.add('epic-link');
			var renderer = new nxt.ClassRenderer(link);
			renderer.render(nxt.Class('large-text', false));
			link.classList.contains('epic-link').should.equal(true);
			link.classList.contains('large-text').should.equal(false);
		});
	});
});
