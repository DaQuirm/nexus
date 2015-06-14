var nx = {
	Cell: require('../../src/core/cell')
};

var nxt = {
	CommandBinding: require('../../src/nxt/command-binding'),
	CommandCell: require('../../src/nxt/command-cell'),
	Text: require('../../src/nxt/helpers').Text
};

describe('nxt.CommandCell', function () {
	'use strict';

	describe('constructor', function () {
		it('creates an array for children cells', function () {
			var commandCell = new nxt.CommandCell();
			commandCell.children.should.be.an.instanceOf(Array);
			commandCell.children.should.be.empty;
		});

		it('stores the `cleanup` options as a property, true by default', function () {
			var commandCell = new nxt.CommandCell();
			commandCell.cleanup.should.equal(true);
			var commandCell = new nxt.CommandCell({ cleanup: false });
			commandCell.cleanup.should.equal(false);
		});
	});

	describe('reverseBind', function () {
		it('creates a command binding with command cell as a target', function () {
			var cell = new nx.Cell({ value: 'cellar door' });
			var commandCell = new nxt.CommandCell();
			var binding = commandCell.reverseBind(cell, nxt.Text);
			binding.should.be.an.instanceOf(nxt.CommandBinding);
		});

		it('stores created binding', function () {
			var cell = new nx.Cell({ value: 'cellar door' });
			var commandCell = new nxt.CommandCell();
			var binding = commandCell.reverseBind(cell, nxt.Text);
			commandCell._binding.should.equal(binding);
		});
	});

	describe('unbind', function () {
		it('removes the binding ', function () {
			var cell = new nx.Cell({ value: 'cellar door' });
			var commandCell = new nxt.CommandCell();
			var binding = commandCell.reverseBind(cell, nxt.Text);
			var command = commandCell.value;
			commandCell.unbind();
			cell.value = 'woooo';
			commandCell.value.should.equal(command);
		});
	});

});
