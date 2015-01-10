describe('nxt.CommandCellModel', function () {
	'use strict';

	var model = nxt.CommandCellModel;

	beforeEach(function () {
		model.cellStack = [];
	});

	describe('cellStack', function () {
		it('is an array to store activated command cells', function () {
			model.cellStack.should.be.an.instanceOf(Array);
			model.cellStack.should.be.empty;
		});
	});

	describe('enter', function () {
		it('pushes a command cell to the cell stack', function () {
			var cell = new nxt.CommandCell();
			model.enter(cell);
			model.cellStack.should.have('length', 1);
			model.cellStack[0].should.equal(cell);
		});

		it('cleans up cell hierarchy by unbinding and removing child cells', function () {
			var root = new nxt.CommandCell();
			var parent = new nxt.CommandCell();
			var child = new nxt.CommandCell();

			var cell = new nx.Cell({ value: '' });

			model.enter(root);
			model.enter(parent);
			model.enter(child);

			cell.bind(child, '->', nxt.Text);

			model.exit(child);
			model.exit(parent);
			model.exit(root);

			model.enter(parent);


		});
	});

	describe('exit', function () {
		it('pops the top from the cell stack', function () {
			var cell = new nxt.CommandCell();
			model.enter(cell);
			model.exit();
			model.cellStack.should.have('length', 0);
			model.cellStack.should.be.empty;
		});
	});
});
