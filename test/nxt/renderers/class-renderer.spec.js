describe('nxt.ClassRenderer', function() {
	'use strict';

	var link;
	var domContext;
	var renderer;

	beforeEach(function () {
		link = document.createElement('a');
		link.classList.add('epic-link');
		renderer = new nxt.ClassRenderer();
		domContext = { container: link };
	});

	describe('add', function() {
		it('adds a class to the element\'s class list if the `set` field is true', function() {
			renderer.add(nxt.Class('large-text', true).data, domContext);
			link.classList.contains('epic-link').should.equal(true);
			link.classList.contains('large-text').should.equal(true);
		});
	});

	describe('remove', function () {
		it('removes a class from the element\'s class list if the `set` field is false', function() {
			renderer.remove(nxt.Class('large-text', false).data, domContext);
			link.classList.contains('epic-link').should.equal(true);
			link.classList.contains('large-text').should.equal(false);
		});
	});
});
