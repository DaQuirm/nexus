describe('nxt.CommandBinding', function () {
	'use strict';

	describe('sync', function () {
		it('wraps nx.Binding\'s sync method in CommandCellModel enter/exit calls', function () {
			var sourceCell = new nxt.CommandCell();
			var targetCell = new nxt.CommandCell();
			var binding = new nxt.CommandBinding(sourceCell, targetCell);
			var cmmEnterSpy = sinon.spy(nxt.CommandCellModel, 'enter');
			var cmmExitSpy = sinon.spy(nxt.CommandCellModel, 'exit');
			var syncSpy = sinon.spy(nx.Binding.prototype.sync);

			binding.sync();
			cmmEnterSpy.should.have.been.calledWith(targetCell);

			sinon.assert.callOrder(cmmEnterSpy, syncSpy, cmmExitSpy);

			nxt.CommandCellModel.enter.restore();
			nxt.CommandCellModel.exit.restore();
		});
	});

});
