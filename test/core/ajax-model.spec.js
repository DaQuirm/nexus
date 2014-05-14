describe('nx.AjaxModel', function() {

	var model;

	before(function() {
		model = new nx.AjaxModel();
	});

	describe('constructor', function() {
		it('creates a new model instance', function() {
			should.exist(model);
		});

		it('initializes the data property using the options parameter', function() {
			model = new nx.AjaxModel({ data: { cellar: 'door' }});
			model.data.value.should.deep.equal({ cellar: 'door' });
		});
	});

	describe('data', function() {
		it('is an nx.Property instance that stores model data', function() {
			model.data.should.be.an.instanceof(nx.Property);
		});
	});

	describe('status', function() {
		it('is an nx.Property instance that stores model\'s status' , function() {
			model.data.should.be.an.instanceof(nx.Property);
		});
	});

	describe('request', function() {
		var xhr, server;
		var url = 'http://localhost/users';

		beforeEach(function () {
			xhr = sinon.useFakeXMLHttpRequest();
			server = sinon.fakeServer.create();
		});

		afterEach(function () {
			xhr.restore();
			server.restore();
		});

		it('sends http requests via xhr to a given URL using GET method', function() {
			model.request({
				url: url,
				method: 'get'
			});
			server.requests.length.should.equal(1);
			server.requests[0].url.should.equal(url);
			server.requests[0].method.should.equal('get');
		});

		it('interpolates the url using placeholders in curly braces and substitute values from model data', function() {
			model.request({
				url: 'http://localhost/users/{_id}',
				method: 'put',
				data: { 'name': 'Samuel', '_id':1337 }
			});
			server.requests.length.should.equal(1);
			server.requests[0].url.should.equal('http://localhost/users/1337');
		});

		it('calls a success handler if request succeeds and passes received data as the first parameter', function() {
			var handler = sinon.spy();
			var response = { 'response': 'cellar door' };
			server.respondWith([
				200,
				{ "Content-Type": "application/json" },
				JSON.stringify(response)
			]);
			model.request({
				url: url,
				method: 'put',
				data: { 'name': 'Samuel' },
				success: handler
			});
			server.respond();
			server.requests.length.should.equal(1);
			handler.should.have.been.calledWith(response);
		});

		it('calls an error handler if request fails and passes an error object as the first parameter', function() {
			var success_handler = sinon.spy();
			var error_handler = sinon.spy();
			var response = { 'error': 'not found' };
			server.respondWith([
				404,
				{ "Content-Type": "application/json" },
				JSON.stringify(response)
			]);
			model.request({
				url: url,
				method: 'put',
				data: { 'name': 'Samuel' },
				success: success_handler,
				error: error_handler
			});
			server.respond();
			server.requests.length.should.equal(1);
			error_handler.should.have.been.calledWith(response);
			success_handler.should.not.have.been.called;
		});

		it('changes model status to loading when request is sent', function() {
			model.request({
				url: url,
				method: 'get'
			});
			model.status.value.should.equal(nx.AsyncStatus.LOADING);
		});

		it('changes model status to done when request is complete', function(done) {
			var response = { 'response': 'cellar door' };
			server.respondWith([
				200,
				{ "Content-Type": "application/json" },
				JSON.stringify(response)
			]);
			model.request({
				url: url,
				method: 'get',
				success: function() {
					model.status.value.should.equal(nx.AsyncStatus.DONE);
					done();
				}
			});
			server.respond();
		});

		it('changes model status to error when request fails', function(done) {
			var response = { 'error': 'not found' };
			server.respondWith([
				404,
				{ "Content-Type": "application/json" },
				JSON.stringify(response)
			]);
			model.request({
				url: url,
				method: 'get',
				error: function() {
					model.status.value.should.equal(nx.AsyncStatus.ERROR);
					done();
				}
			});
			server.respond();
		});
	});
});
