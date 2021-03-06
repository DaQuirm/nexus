var nxt = {
	Event: require('../../../src/nxt/helpers').Event,
	EventRenderer: require('../../../src/nxt/renderers')('EventRenderer')
};

describe('nxt.EventRenderer', function () {
	'use strict';

	var element;
	var domContext;
	var renderer = nxt.EventRenderer;

	beforeEach(function () {
		element = document.createElement('div');
		domContext = { container: element };
	});

	describe('add', function () {
		it('attaches an event handler to the element', function () {
			var handler = sinon.spy();
			renderer.add(nxt.Event('click', handler).data, domContext);
			element.click();
			/* eslint-disable no-unused-expressions */
			handler.should.have.been.called;
			/* eslint-enable */
		});

		it('returns event handler and event name', function () {
			var handler = function () {};
			var content = renderer.add(nxt.Event('click', handler).data, domContext);
			content.should.deep.equal({ name: 'click', handler: handler });
		});
	});

	describe('unrender', function () {
		it('removes the previously attached event handler', function () {
			var handler = sinon.spy();
			domContext.content = renderer.add(nxt.Event('click', handler).data, domContext);
			renderer.unrender(domContext);
			element.click();
			/* eslint-disable no-unused-expressions */
			handler.should.not.have.been.called;
			/* eslint-enable */
		});
	});
});
