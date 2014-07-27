describe('nxt.AttrRenderer', function() {
	'use strict';

	var renderer;
	var domContext;

	beforeEach(function () {
		renderer = new nxt.AttrRenderer();
		domContext = { container: document.createElement('a') };
	});

	describe('set', function() {
		it('sets an attribute of a DOM element', function() {
			renderer.render(nxt.Attr('class', 'large-text').data, domContext);
			domContext.container.getAttribute('class').should.equal('large-text');
		});

		it('sets an array of attributes of a DOM element passed as an object literal', function() {
			renderer.render(nxt.Attr({
				'class': 'large-text',
				'id': 'awesomest-link-ever'
			}).data, domContext);
			domContext.container.getAttribute('class').should.equal('large-text');
			domContext.container.getAttribute('id').should.equal('awesomest-link-ever');
		});
	});
});
