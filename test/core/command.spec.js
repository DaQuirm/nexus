var nx = {
	Command: require('../../src/core/command')
};

describe('nx.Command', function () {

	var commandTarget = {
		method: sinon.spy(function (argument) {
			return argument.cellar.toUpperCase();
		})
	};

	var data = { cellar: 'door' };
	var command;

	beforeEach(function () {
		command = new nx.Command('method', data);
	});

	describe('constructor', function () {
		it('creates a command object and stores method name and argument data', function () {
			command.method.should.equal('method');
			command.data.should.deep.equal(data);
		});
	});

	describe('apply', function () {
		it('executes object\'s method passing command data as an argument', function () {
			command.apply(commandTarget);
			commandTarget.method.should.have.been.calledWith(command.data);
		});

		it('uses target object as `this`', function () {
			var target = {
				method: function () {
					this.should.equal(target);
				}
			};
			command.apply(target);
		});

		it('returns what the method returns', function () {
			var result = command.apply(commandTarget);
			result.should.equal(commandTarget.method(data));
		});

		it('passes its second and further arguments to the method', function () {
			command.apply(commandTarget, 'cellar', 'door');
			commandTarget.method.should.have.been.calledWith(command.data, 'cellar', 'door');
		});
	});

});
