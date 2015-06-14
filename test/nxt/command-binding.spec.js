var nx = {
	Binding: require('../../src/core/binding')
};

var nxt = {
	CommandBinding: require('../../src/nxt/command-binding'),
	CommandCell: require('../../src/nxt/command-cell'),
	CommandCellModel: require('../../src/nxt/command-cell-model')
};

describe('nxt.CommandBinding', function () {
	'use strict';

	describe('constructor', function () {
		it('stores itself in the source cell\'s bindings hash map', function () {
			var sourceCell = new nxt.CommandCell();
			var targetCell = new nxt.CommandCell();
			var binding = new nxt.CommandBinding(sourceCell, targetCell);
			sourceCell.bindings[0].should.equal(binding);
			sourceCell._bindingIndex.should.equal(1);
			binding.index.should.equal(0);
		});
	});

	describe('sync', function () {
		it('wraps nx.Binding\'s sync method in CommandCellModel enter/exit calls', function () {
			var sourceCell = new nxt.CommandCell();
			var targetCell = new nxt.CommandCell();
			var binding = new nxt.CommandBinding(sourceCell, targetCell);
			var cmmEnterSpy = sinon.spy(nxt.CommandCellModel, 'enter');
			var cmmExitSpy = sinon.spy(nxt.CommandCellModel, 'exit');
			var syncSpy = sinon.spy(nx.Binding.prototype, 'sync');

			binding.sync();

			cmmEnterSpy.should.have.been.calledWith(targetCell);
			sinon.assert.callOrder(cmmEnterSpy, syncSpy, cmmExitSpy);

			nxt.CommandCellModel.enter.restore();
			nxt.CommandCellModel.exit.restore();
			nx.Binding.prototype.sync.restore();
		});
	});

});
