var nxt = {
	Class: require('../../../src/nxt/helpers').Class,
	ClassRenderer: require('../../../src/nxt/renderers')('ClassRenderer')
};

describe('nxt.ClassRenderer', function () {
	'use strict';

	var link;
	var domContext;
	var renderer = nxt.ClassRenderer;

	beforeEach(function () {
		link = document.createElement('a');
		link.classList.add('epic-link');
		domContext = { container: link };
	});

	describe('render', function () {
		it('adds a class to the element\'s class list', function () {
			renderer.render(nxt.Class('large-text').data, domContext);
			link.classList.contains('epic-link').should.equal(true);
			link.classList.contains('large-text').should.equal(true);
		});

		it('returns class name', function () {
			var className = 'cellar-door';
			var content = renderer.render(nxt.Class(className).data, domContext);
			content.should.deep.equal(className);
		});

		it('removes previously rendered class', function () {
			domContext.content = renderer.render(nxt.Class('large-text').data, domContext);
			renderer.render(nxt.Class('cellar-door').data, domContext);
			link.classList.contains('epic-link').should.equal(true);
			link.classList.contains('cellar-door').should.equal(true);
			link.classList.contains('large-text').should.equal(false);
		});
	});

	describe('unrender', function () {
		it('removes a class from the element\'s class list', function () {
			link.classList.add('epic-link');
			domContext.content = renderer.render(nxt.Class('large-text').data, domContext);
			link.classList.contains('large-text').should.equal(true);
			renderer.unrender(domContext);
			link.classList.contains('epic-link').should.equal(true);
			link.classList.contains('large-text').should.equal(false);
		});
	});
});
