var nx = {
	Cell: require('../../src/core/cell'),
	RestDocument: require('../../src/rest/rest-document')
};

describe('nx.RestDocument', function () {

	var model, xhr, server;
	var url = 'http://localhost/users/37';

	beforeEach(function () {
		xhr = sinon.useFakeXMLHttpRequest();
		model = new nx.RestDocument({ url: url });
		server = sinon.fakeServer.create();
	});

	afterEach(function () {
		if (xhr.restore) {
			xhr.restore();
		}
		server.restore();
	});

	describe('constructor', function () {
		it('creates a new document model instance based on a URL', function () {
			model.options.url.should.equal(url);
		});

		it('creates a new document model instance based on a data object', function () {
			var data = {
				firstname: 'Samuel',
				lastname: 'Vimes'
			};
			model = new nx.RestDocument({
				url: url,
				data: data
			});
			model.options.url.should.equal(url);
			model.data.value.should.deep.equal(data);
		});
	});

	describe('data', function () {
		it('is an nx.Cell that holds document data', function () {
			model.data.should.be.an.instanceOf(nx.Cell);
		});
	});

	describe('retrieve', function () {
		it('asynchronously gets document data with a GET request', function (done) {
			var response = { 'response': 'cellar door' };
			server.respondWith([
				200,
				{ 'Content-Type': 'application/json' },
				JSON.stringify(response)
			]);
			model.retrieve(function (data) {
				/* eslint-disable no-unused-expressions */
				data.should.be.json;
				/* eslint-enable */
				model.data.value.should.deep.equal(data);
				server.requests.length.should.equal(1);
				server.requests[0].url.should.equal(url);
				server.requests[0].method.should.equal('get');
				done();
			});
			server.respond();
		});

		it('updates the `data` property with response data', function (done) {
			var response = { 'response': 'cellar door' };
			server.respondWith([
				200,
				{ 'Content-Type': 'application/json' },
				JSON.stringify(response)
			]);
			model.retrieve(function () {
				model.data.value.should.deep.equal(response);
				done();
			});
			server.respond();
		});
	});

	describe('save', function () {
		it('asynchronously updates document data with a PUT request', function (done) {
			var requestSpy = sinon.spy(model, 'request');
			model.data.value = { name: 'Samuel' };
			server.respondWith([
				200,
				{ 'Content-Type': 'application/json' },
				JSON.stringify({ name: 'Samuel' })
			]);
			model.save(function () {
				/* eslint-disable no-unused-expressions */
				requestSpy.should.have.been.calledOnce;
				/* eslint-enable */
				var requestOptions = requestSpy.lastCall.args[0];
				requestOptions.should.have.property('method', 'put');
				model.request.restore();
				done();
			});
			server.respond();
		});
	});

	describe('remove', function () {
		it('deletes document data with a DELETE request', function (done) {
			var requestSpy = sinon.spy(model, 'request');
			server.respondWith([204, '', '']);
			model.remove(function () {
				/* eslint-disable no-unused-expressions */
				requestSpy.should.have.been.calledOnce;
				/* eslint-enable */
				var requestOptions = requestSpy.lastCall.args[0];
				requestOptions.should.have.property('method', 'delete');
				model.request.restore();
				done();
			});
			server.respond();
		});
	});
});
