var _ = require('lodash');

var nx = {
	Cell: require('../../src/core/cell'),
	Collection: require('../../src/core/collection')
};

var renderers = require('../../src/nxt/renderers');

var nxt = _.assign(
	{
		Command: require('../../src/nxt/command'),
		ContentRegion: require('../../src/nxt/content-region'),

		AttrRenderer: renderers('AttrRenderer'),
		EventRenderer: renderers('EventRenderer'),
		NodeRenderer: renderers('NodeRenderer')
	},
	require('../../src/nxt/helpers')
);

describe('nxt.ContentRegion', function () {
	'use strict';

	var element;
	var domContext;
	var region;

	beforeEach(function () {
		element = document.createElement('div');
		domContext = { container: element };
		region = new nxt.ContentRegion(domContext);
	});

	describe('constructor', function () {
		it('creates a new content region based on a DOM context', function () {
			region.domContext.should.deep.equal(domContext);
			region.cells.should.be.an.instanceof(Array);
			/* eslint-disable no-unused-expressions */
			region.cells.should.be.empty;
			/* eslint-enable */
		});
	});

	describe('add', function () {
		it('binds and maps a content cell to a new cell in the cell collection', function () {
			var cell;
			for (var index = 0; index < 3; index++) {
				cell = new nx.Cell();
				region.add(cell);
			}
			region.cells.length.should.equal(3);
			var command = new nxt.Command('Node', 'render', nxt.Text('cellar door').data);
			cell.value = command;
			region.cells[2].value.command.should.deep.equal(command);
		});

		it('assigns an index to the newly added cell', function () {
			var cell = new nx.Cell();
			region.add(cell);
			region.cells[0].value.index.should.equal(0);
		});

		it('copies its domContext for each cell instead of passing it by reference', function () {
			var cell = new nx.Cell();
			region.add(cell);
			domContext = '!';
			region.cells[0].value.domContext.should.not.equal('!');
			region.cells[0].value.domContext.should.be.an('object');
		});
	});

	describe('update', function () {
		it('runs cell\'s command and updates the renderer field', function () {
			var data = { node: document.createElement('div') };
			var command = new nxt.Command('Node', 'render', data);
			domContext = { container: element };
			var runSpy = sinon.spy(command, 'run');
			var cell = new nx.Cell({
				value: {
					index: 0,
					command: command,
					domContext: domContext,
					visible: false
				}
			});

			region.update(cell.value);
			runSpy.should.have.been.calledWith(domContext);
			element.childNodes.length.should.equal(1);
			cell.value.renderer.should.equal(nxt.NodeRenderer);
		});

		it('updates cell\'s DOM context with rendered content', function () {
			var data = { node: document.createElement('div') };
			var command = new nxt.Command('Node', 'render', data);
			var cell = new nx.Cell({
				value: {
					index: 0,
					command: command,
					domContext: domContext,
					visible: false
				}
			});
			domContext = {
				container: element
			};

			region.update(cell.value);
			cell.value.domContext.content.should.equal(data.node);
		});

		it('updates cell\'s visibility', function () {
			var data = { node: document.createElement('div') };
			var command = new nxt.Command('Node', 'render', data);
			var cell = new nx.Cell({
				value: {
					index: 0,
					command: command,
					domContext: domContext,
					visible: false
				}
			});

			domContext = {
				container: element
			};
			region.update(cell.value);
			cell.value.visible.should.equal(true);
			cell.value = {
				index: 0,
				command: undefined,
				domContext: domContext,
				visible: false
			};
			cell.value.visible.should.equal(false);
		});

		it('considers content invisible if the renderer has no `visible` method', function () {
			var data = { name: 'class', value: 'cellar-door' };
			var command = new nxt.Command('Attr', 'render', data);
			var cell = new nx.Cell({
				value: {
					index: 0,
					command: command,
					domContext: domContext,
					visible: false
				}
			});

			domContext = {
				container: element
			};
			region.update(cell.value);
			cell.value.visible.should.equal(false);
		});

		it('calls the unrender method of the previous renderer if command calls a different renderer', function () {
			var cell = new nx.Cell();
			region.add(cell);
			var data = { node: document.createElement('div') };
			cell.value = new nxt.Command('Node', 'render', data);
			region.cells[0].value.renderer.should.equal(nxt.NodeRenderer);
			var spy = sinon.spy(region.cells[0].value.renderer, 'unrender');
			data = { name: 'class', value: 'cellar door' };
			cell.value = new nxt.Command('Attr', 'render', data);
			region.cells[0].value.renderer.should.equal(nxt.AttrRenderer);
			region.cells[0].value.visible.should.equal(false);
			/* eslint-disable no-unused-expressions */
			spy.should.have.been.called;
			/* eslint-enable */
			spy.getCall(0).args[0].container.should.equal(domContext.container);
			spy.restore();
		});

		it('calls the unrender method of the previous renderer if command is undefined', function () {
			var cell = new nx.Cell();
			region.add(cell);
			var data = { node: document.createElement('div') };
			cell.value = new nxt.Command('Node', 'render', data);
			region.cells[0].value.renderer.should.equal(nxt.NodeRenderer);
			var spy = sinon.spy(region.cells[0].value.renderer, 'unrender');
			data = { name: 'class', value: 'cellar door' };
			cell.value = undefined;
			/* eslint-disable no-unused-expressions */
			spy.should.have.been.called;
			/* eslint-enable */
			spy.getCall(0).args[0].container.should.equal(domContext.container);
			region.cells[0].value.visible.should.equal(false);
			// no need for a spy.restore() call because renderer is removed
		});

		it('calls the unrender method of the event renderer if command is undefined', function () {
			var cell = new nx.Cell();
			region.add(cell);
			var data = { name: 'click', handler: sinon.spy() };
			cell.value = new nxt.Command('Event', 'add', data);
			region.cells[0].value.renderer.should.equal(nxt.EventRenderer);
			domContext.container.click();
			/* eslint-disable no-unused-expressions */
			data.handler.should.have.been.calledOnce;
			/* eslint-enable */
			var spy = sinon.spy(region.cells[0].value.renderer, 'unrender');
			cell.value = undefined;
			/* eslint-disable no-unused-expressions */
			spy.should.have.been.called;
			/* eslint-enable */
			spy.getCall(0).args[0].container.should.equal(domContext.container);
			region.cells[0].value.visible.should.equal(false);
			domContext.container.click();
			/* eslint-disable no-unused-expressions */
			data.handler.should.have.been.calledOnce;
			/* eslint-enable */
			// no need for a spy.restore() call because renderer is removed
		});

		it('removes the renderer from the state when unrendering to prevent unrendering with no content', function () {
			var cell = new nx.Cell();
			region.add(cell);
			var data = { node: document.createElement('div') };
			cell.value = new nxt.Command('Node', 'render', data);
			region.cells[0].value.renderer.should.equal(nxt.NodeRenderer);
			data = { name: 'class', value: 'cellar door' };
			cell.value = undefined;
			should.not.exist(region.cells[0].value.renderer);
			/* eslint-disable no-unused-expressions */
			(function () {
				cell.value = undefined;
			}).should.not.throw;
			/* eslint-enable */
		});
	});

	/* eslint-disable max-len */
	it('keeps track of items\' visibility and updates insert references so that items are rendered in the correct order', function () {
	/* eslint-enable */
		var first = new nx.Cell();
		var second = new nx.Cell();
		var between = new nx.Cell();
		var addCell = function (cell) {
			region.add(nxt.Binding(cell, nxt.Text));
		};
		addCell(first);
		addCell(between);
		addCell(second);
		second.value = 'roll';
		element.childNodes.length.should.equal(1);
		element.textContent.should.equal('roll');
		first.value = 'rock';
		element.childNodes.length.should.equal(2);
		element.textContent.should.equal('rockroll');
		between.value = ' & ';
		element.childNodes.length.should.equal(3);
		element.textContent.should.equal('rock & roll');
	});

	it('keeps track of visibility of all dynamic items', function () {
		var collection = new nx.Collection();
		var between = new nx.Cell();
		var cell = new nx.Cell();
		region.add(nxt.Collection(collection, nxt.Text));
		region.add(nxt.Binding(between, nxt.Text));
		region.add(nxt.Binding(cell, nxt.Text));
		cell.value = 'roll';
		element.childNodes.length.should.equal(1);
		element.textContent.should.equal('roll');
		collection.append('r', 'o', 'c', 'k');
		element.childNodes.length.should.equal(5);
		element.textContent.should.equal('rockroll');
		between.value = ' & ';
		element.childNodes.length.should.equal(6);
		element.textContent.should.equal('rock & roll');
	});

	it('preserves the order of dynamic items regardless of their current content', function () {
		var cell = new nx.Cell();
		var between = new nx.Cell();
		var collection = new nx.Collection({ items: ['r', 'o'] });
		region.add(nxt.Binding(cell, nxt.Text));
		region.add(nxt.Binding(between, nxt.Text));
		region.add(nxt.Collection(collection, nxt.Text));
		cell.value = 'rock';
		element.childNodes.length.should.equal(3);
		element.textContent.should.equal('rockro');
		collection.append('l', 'l');
		element.childNodes.length.should.equal(5);
		element.textContent.should.equal('rockroll');
		between.value = ' & ';
		element.childNodes.length.should.equal(6);
		element.textContent.should.equal('rock & roll');
	});

	it('uses an insert reference for prepending content instead of appending it to the element directly', function () {
		var exclamationMark = document.createTextNode('!');
		element.appendChild(exclamationMark);
		region = new nxt.ContentRegion({
			container: element,
			insertReference: exclamationMark
		});
		var addCell = function (cell) {
			region.add(nxt.Binding(cell, nxt.Text));
		};
		var first = new nx.Cell();
		var between = new nx.Cell();
		var second = new nx.Cell();
		addCell(first);
		addCell(between);
		addCell(second);
		region.insertReference = exclamationMark;
		second.value = 'roll';
		element.childNodes.length.should.equal(2);
		element.textContent.should.equal('roll!');
		first.value = 'rock';
		element.childNodes.length.should.equal(3);
		element.textContent.should.equal('rockroll!');
		between.value = ' & ';
		element.childNodes.length.should.equal(4);
		element.textContent.should.equal('rock & roll!');
	});

	it('updates cells\' domContexts based on content and visibility changes of a certain element', function () {
		var converter = function (value) {
			if (value !== 'off') {
				return nxt.Text(value);
			}
		};

		var cells = [];
		for (var index = 0; index < 4; index++) {
			cells[index] = new nx.Cell({ value: 'off' });
			var commandCell = nxt.Binding(cells[index], converter);
			region.add(commandCell);
		}

		/* eslint-disable no-unused-expressions */
		element.textContent.should.be.empty;
		/* eslint-enable */
		cells[1].value = 'b';
		region.cells[0].value.domContext.insertReference.should.equal(region.cells[1].value.domContext.content);
		should.not.exist(region.cells[1].value.domContext.insertReference);
		element.textContent.should.equal('b');
		cells[3].value = 'd';
		region.cells[0].value.domContext.insertReference.should.equal(region.cells[1].value.domContext.content);
		region.cells[1].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		region.cells[2].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		should.not.exist(region.cells[3].value.domContext.insertReference);
		element.textContent.should.equal('bd');
		cells[2].value = 'c';
		region.cells[0].value.domContext.insertReference.should.equal(region.cells[1].value.domContext.content);
		region.cells[1].value.domContext.insertReference.should.equal(region.cells[2].value.domContext.content);
		region.cells[2].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		should.not.exist(region.cells[3].value.domContext.insertReference);
		element.textContent.should.equal('bcd');
		cells[2].value = 'off';
		region.cells[0].value.domContext.insertReference.should.equal(region.cells[1].value.domContext.content);
		region.cells[1].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		region.cells[2].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		should.not.exist(region.cells[3].value.domContext.insertReference);
		element.textContent.should.equal('bd');
		cells[1].value = 'off';
		region.cells[0].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		region.cells[1].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		region.cells[2].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		should.not.exist(region.cells[3].value.domContext.insertReference);
		element.textContent.should.equal('d');
		cells[3].value = 'off';
		should.not.exist(region.cells[0].value.domContext.insertReference);
		should.not.exist(region.cells[1].value.domContext.insertReference);
		should.not.exist(region.cells[2].value.domContext.insertReference);
		should.not.exist(region.cells[3].value.domContext.insertReference);
		/* eslint-disable no-unused-expressions */
		element.textContent.should.be.empty;
		/* eslint-enable */
		cells[3].value = 'd';
		region.cells[0].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		region.cells[1].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		region.cells[2].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		should.not.exist(region.cells[3].value.domContext.insertReference);
		element.textContent.should.equal('d');
		cells[0].value = 'a';
		region.cells[0].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		region.cells[1].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		region.cells[2].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		should.not.exist(region.cells[3].value.domContext.insertReference);
		element.textContent.should.equal('ad');
		cells[2].value = 'c';
		region.cells[0].value.domContext.insertReference.should.equal(region.cells[2].value.domContext.content);
		region.cells[1].value.domContext.insertReference.should.equal(region.cells[2].value.domContext.content);
		region.cells[2].value.domContext.insertReference.should.equal(region.cells[3].value.domContext.content);
		should.not.exist(region.cells[3].value.domContext.insertReference);
		element.textContent.should.equal('acd');
	});

	it('updates cells\' insertReferences when a cell\'s content changes', function () {
		region = new nxt.ContentRegion({
			container: element
		});
		var addCell = function (cell) {
			region.add(nxt.Binding(cell, nxt.Text));
		};
		var first = new nx.Cell();
		var second = new nx.Cell();
		addCell(first);
		addCell(second);
		second.value = 'rock';
		region.cells[0].value.domContext.insertReference.should.equal(region.cells[1].value.domContext.content);
		second.value = 'roll';
		region.cells[0].value.domContext.insertReference.should.equal(region.cells[1].value.domContext.content);
	});
});
