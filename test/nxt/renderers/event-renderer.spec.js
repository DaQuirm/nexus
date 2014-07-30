describe('nxt.EventRenderer', function() {
	'use strict';

	var element;
	var domContext;
	var renderer;

	beforeEach(function () {
		element = document.createElement('div');
		domContext = { container: element };
		renderer = new nxt.EventRenderer();
	});

	describe('add', function() {
		it('attaches an event handler to the element', function() {
			var handler = sinon.spy();
			renderer.add(nxt.Event('click', handler).data, domContext);
			element.click();
			handler.should.have.been.called;
		});
	});
});
