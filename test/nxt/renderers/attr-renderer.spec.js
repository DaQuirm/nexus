describe('nxt.AttrRenderer', function() {
	'use strict';

	var renderer;
	var domContext;

	beforeEach(function () {
		renderer = new nxt.AttrRenderer();
		domContext = { container: document.createElement('a') };
	});

	describe('render', function() {
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

		it('returns attribute\'s name and value', function () {
			var data = {
				'class': 'large-text',
				'id': 'awesomest-link-ever'
			};
			var content = renderer.render(nxt.Attr(data).data, domContext);
			content.should.deep.equal(data);
		});

		it('correctly sets the value attribute', function () {
			domContext = { container: document.createElement('input') };
			domContext.container.value = '';
			renderer.render(nxt.Attr('value', 'cellar door').data, domContext);
			domContext.container.value.should.equal('cellar door');
		});
	});

	describe('unrender', function () {
		it('unsets attributes of the container', function() {
			domContext.content = renderer.render(nxt.Attr('data-type', 'large-text').data, domContext);
			domContext.container.getAttribute('data-type').should.equal('large-text');
			renderer.unrender(domContext);
			domContext.container.hasAttribute('data-type').should.equal(false);
		});
	});
});
