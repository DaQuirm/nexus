var FakeRenderer = {
	method: sinon.spy(function (data) {
		return data.cellar;
	})
};

var nxt = {
	Command: require('inject!../../src/nxt/command')({
		'./renderers': {
			FakeRenderer: FakeRenderer
		}
	})
};

describe('nxt.Command', function () {

	describe('constructor', function () {
		it('creates a command object with a certain type, method corresponding to a renderer method and arguments', function () {
			var data = { cellar: 'door' };
			var command = new nxt.Command('renderer', 'method', data);
			command.method.should.equal('method');
			command.type.should.equal('renderer');
			command.data.should.deep.equal(data);
		});
	});

	describe('run', function () {
		it('calls the appropriate renderer method, passing data and its arguments', function () {
			var data = { cellar: 'door' };
			var command = new nxt.Command('Fake', 'method', data);
			var domContext = { container: document.createElement('div') };
			command.run(domContext);
			FakeRenderer.method.should.have.been.calledWith(data, domContext);
		});

		it('returns content rendered by the renderer', function () {
			var data = { cellar: 'door' };
			var command = new nxt.Command('Fake', 'method', data);
			var domContext = { container: document.createElement('div') };
			var content = command.run(domContext);
			content.should.equal('door');
		});

		it('stores the renderer reference', function(){
			var data = { cellar: 'door' };
			var command = new nxt.Command('Fake', 'method', data);
			var domContext = { container: document.createElement('div') };
			command.run(domContext);
			command.renderer.should.equal(FakeRenderer);
		});
	});
});
