describe('nxt.EventRenderer', function() {
	'use strict';

	describe('constructor', function() {
		it('creates an event managing instance by event name and handler', function() {
			var element = document.createElement('div');
			var renderer = new nxt.EventRenderer(element);
			renderer.element.should.equal(element);
		});
	});

	describe('render', function() {
		it('attaches an event handler to the element', function() {
			var element = document.createElement('div');
			var renderer = new nxt.EventRenderer(element);
			var handler = sinon.spy();
			renderer.render(nxt.Event('click', handler));
			element.click();
			handler.should.have.been.called;
		});
	});
});
