describe('nx.AjaxModel', function() {

	var model;

	before(function() {
		model = new nx.AjaxModel();
	});

	describe('constructor', function() {
		it('creates a new model instance', function() {
			should.exist(model);
		});
	});

	describe('request', function() {
		var xhr, requests;
		var url = 'http://localhost/users';

		beforeEach(function () {
			server = sinon.fakeServer.create();
			xhr = sinon.useFakeXMLHttpRequest();
			requests = [];
			xhr.onCreate = function (req) { requests.push(req); };
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
			requests.length.should.equal(1);
			requests[0].url.should.equal(url);
			request.method.should.equal('get');
		});

		it('sends http requests with data when specified', function() {
			model.request({
				url: url,
				method: 'post',
				data: { 'name': 'Samuel' }
			});
			requests.length.should.equal(1);
			requests[0].url.should.equal(url);
			request.method.should.equal('post');
		});

		it('interpolates the url using placeholders in curly braces and substitute values from model data', function() {
			model.request({
				url: 'http://localhost/users/{_id}',
				method: 'put',
				data: { 'name': 'Samuel', '_id':1337 }
			});
			requests.length.should.equal(1);
			requests[0].url.should.equal(url);
		});

		it('calls a success handler if request succeeds and passes received data as the first parameter', function() {
			var handler = sinon.spy();
			model.request({
				url: url,
				method: 'put',
				data: { 'name': 'Samuel' },
				success: handler
			});
			var response = { 'response': 'cellar door' };
			server.requests.length.should.equal(1);
			server.requests[0].respond(
				200,
				{ "Content-Type": "application/json" },
				JSON.stringify(response)
			);
			handler.should.have.been.calledWith(response);
		});

		it('calls an error handler if request fails and passes an error object as the first parameter', function() {
			var success_handler = sinon.spy();
			var error_handler = sinon.spy();
			model.request({
				url: url,
				method: 'put',
				data: { 'name': 'Samuel' },
				success: success_handler,
				error: error_handler
			});
			var response = { 'error': 'not found' };
			server.requests.length.should.equal(1);
			server.requests[0].respond(
				404,
				{ "Content-Type": "application/json" },
				JSON.stringify(response)
			);
			error_handler.should.have.been.calledWith(response);
			success_handler.should.not.have.been.called;
		});

	});
});
