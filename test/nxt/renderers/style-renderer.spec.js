describe('nxt.StyleRenderer', function() {
	'use strict';

	var renderer = nxt.StyleRenderer;
	var domContext;
	var style = {
		'font-size': '15px',
		'background': 'red'
	};

	beforeEach(function () {
		domContext = { container: document.createElement('div') };
	});

	describe('render', function() {
		it('sets styles of DOM element', function() {
			renderer.render(nxt.Style(style).data, domContext);
			domContext.container.style.fontSize.should.equal('15px');
			domContext.container.style.background.should.equal('red');
		});

		it('returns style names and values', function () {
			var _style = renderer.render(nxt.Style(style).data, domContext);
			_style.should.deep.equal(style);
		});
	});

	describe('unrender', function () {
		it('removes styles of DOM element', function () {
			domContext.content = renderer.render(nxt.Style(style).data, domContext);
			renderer.unrender(domContext);
			domContext.container.style.fontSize.should.equal('');
		});
	});
});
