var nx = {
	Cell: require('../../src/core/cell')
};

var nxt = {
	CommandCell: require('../../src/nxt/command-cell'),
	CommandCellModel: require('../../src/nxt/command-cell-model'),
	Text: require('../../src/nxt/helpers').Text
};

describe('nxt.CommandCellModel', function () {
	'use strict';

	var model = nxt.CommandCellModel;

	beforeEach(function () {
		model.cellStack = [];
	});

	describe('cellStack', function () {
		it('is an array to store activated command cells', function () {
			model.cellStack.should.be.an.instanceOf(Array);
			/* eslint-disable no-unused-expressions */
			model.cellStack.should.be.empty;
			/* eslint-enable */
		});
	});

	describe('enter', function () {
		it('pushes a command cell to the cell stack', function () {
			var cell = new nxt.CommandCell();
			model.enter(cell);
			model.cellStack.should.have.property('length', 1);
			model.cellStack[0].should.equal(cell);
		});

		it('builds cell hierarchy by storing children in parent cells', function () {
			var root = new nxt.CommandCell();
			var parent = new nxt.CommandCell();
			var child = new nxt.CommandCell();
			var anotherChild = new nxt.CommandCell();

			model.enter(root);
			model.enter(parent);

			model.enter(child);
			model.exit(child);

			model.enter(anotherChild);
			model.exit(anotherChild);

			model.exit(parent);
			model.exit(root);

			root.children.should.have.property('length', 1);
			root.children[0].should.equal(parent);
			parent.children.should.have.property('length', 2);
			parent.children.should.deep.equal([
				child,
				anotherChild
			]);
		});

		it('cleans up cell hierarchy by unbinding and removing child cells', function () {
			var root = new nxt.CommandCell();
			var parent = new nxt.CommandCell();
			var child = new nxt.CommandCell();

			var cell = new nx.Cell({ value: '' });

			model.enter(root);
			model.enter(parent);

			child.reverseBind(cell, nxt.Text);

			model.exit(parent);
			model.exit(root);

			model.enter(parent);
			var command = child.value;
			cell.value = 'cellar door';
			child.value.should.equal(command);
		});

		it('performs a full subtree clean-up', function () {
			var root = new nxt.CommandCell();
			var parent = new nxt.CommandCell();
			var child = new nxt.CommandCell();

			var cell = new nx.Cell({ value: '' });

			model.enter(root);
			model.enter(parent);

			child.reverseBind(cell, nxt.Text);

			model.exit(parent);
			model.exit(root);

			model.enter(root);
			var command = child.value;
			cell.value = 'cellar door';
			child.value.should.equal(command);
		});

		it('doesn\'t perform cleanup if cell has the `cleanup` option set', function () {
			var root = new nxt.CommandCell();
			var parent = new nxt.CommandCell({ cleanup: false });
			var child = new nxt.CommandCell();

			var cell = new nx.Cell({ value: '' });

			model.enter(root);
			model.enter(parent);

			child.reverseBind(cell, nxt.Text);

			model.exit(parent);
			model.exit(root);

			model.enter(parent);

			cell.value = 'cellar door';
			child.value.should.deep.equal(nxt.Text('cellar door'));

			model.exit(parent);

			model.enter(root);
			var command = child.value;
			cell.value = 'silence';
			child.value.should.equal(command);
			model.exit(root);
		});
	});

	describe('exit', function () {
		it('pops the top from the cell stack', function () {
			var cell = new nxt.CommandCell();
			model.enter(cell);
			model.exit();
			model.cellStack.should.have.property('length', 0);
			/* eslint-disable no-unused-expressions */
			model.cellStack.should.be.empty;
			/* eslint-enable */
		});
	});
});
