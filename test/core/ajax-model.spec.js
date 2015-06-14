var _ = require('lodash');

var nx = _.assign(
	{
		Cell: require('../../src/core/cell')
	},
	require('../../src/core/ajax-model')
);

describe('nx.AjaxModel', function () {

	var model;

	beforeEach(function () {
		model = new nx.AjaxModel();
	});

	describe('constructor', function () {
		it('creates a new model instance', function () {
			should.exist(model);
		});

		it('initializes the data cell using the options parameter', function () {
			model = new nx.AjaxModel({ data: { cellar: 'door' }});
			model.data.value.should.deep.equal({ cellar: 'door' });
		});
	});

	describe('data', function () {
		it('is an nx.Cell instance that stores model data', function () {
			model.data.should.be.an.instanceof(nx.Cell);
		});
	});

	describe('status', function () {
		it('is an nx.Cell instance that stores model\'s status', function () {
			model.data.should.be.an.instanceof(nx.Cell);
		});
	});

	describe('request', function () {
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

		it('sends http requests via xhr to a given URL using GET method', function () {
			model.request({
				url: url,
				method: 'get'
			});
			server.requests.length.should.equal(1);
			server.requests[0].url.should.equal(url);
			server.requests[0].method.should.equal('get');
		});

		it('sends the data cell value if POST or PUT methods are used', function () {
			var data = { 'cellar': 'door' };
			model.data.value = data;
			model.request({
				url: url,
				method: 'post'
			});
			server.requests.length.should.equal(1);
			server.requests[0].url.should.equal(url);
			server.requests[0].method.should.equal('post');
			server.requests[0].requestBody.should.equal(JSON.stringify(data));
		});

		/* eslint-disable max-len */
		it('interpolates the url using placeholders in curly braces and substitute values from model data', function () {
		/* eslint-enable */
			model.data.value = { 'name': 'Samuel', '_id':1337 };
			model.request({
				url: 'http://localhost/users/{_id}',
				method: 'put'
			});
			server.requests.length.should.equal(1);
			server.requests[0].url.should.equal('http://localhost/users/1337');
		});

		it('updates the data cell if request succeeds', function () {
			var response = { 'response': 'cellar door' };
			server.respondWith([
				200,
				{ 'Content-Type': 'application/json' },
				JSON.stringify(response)
			]);
			model.data.value = { 'name': 'Samuel' };
			model.request({
				url: url,
				method: 'put'
			});
			server.respond();
			model.data.value.should.deep.equal(response);
		});

		it('calls a success handler if request succeeds and passes received data as the first parameter', function () {
			var handler = sinon.spy();
			var response = { 'response': 'cellar door' };
			server.respondWith([
				200,
				{ 'Content-Type': 'application/json' },
				JSON.stringify(response)
			]);
			model.data.value = { 'name': 'Samuel' };
			model.request({
				url: url,
				method: 'put',
				success: handler
			});
			server.respond();
			server.requests.length.should.equal(1);
			handler.should.have.been.calledWith(response);
		});

		it('calls an error handler if request fails and passes an error object as the first parameter', function () {
			var successHandler = sinon.spy();
			var errorHandler = sinon.spy();
			var response = { 'error': 'not found' };
			server.respondWith([
				404,
				{ 'Content-Type': 'application/json' },
				JSON.stringify(response)
			]);
			model.data.value = { 'name': 'Samuel' };
			model.request({
				url: url,
				method: 'put',
				success: successHandler,
				error: errorHandler
			});
			server.respond();
			server.requests.length.should.equal(1);
			errorHandler.should.have.been.calledWith(response);
			/* eslint-disable no-unused-expressions */
			successHandler.should.not.have.been.called;
			/* eslint-enable */
		});

		it('saves xhr data to the error cell', function (done) {
			var response = { 'error': 'not found' };
			server.respondWith([
				404,
				{ 'Content-Type': 'application/json' },
				JSON.stringify(response)
			]);
			model.request({
				url: url,
				method: 'put',
				error: function (data) {
					model.error.value.should.deep.equal(data);
					done();
				}
			});
			server.respond();
		});

		it('changes model status to loading when request is sent', function () {
			model.request({
				url: url,
				method: 'get'
			});
			model.status.value.should.equal(nx.AsyncStatus.LOADING);
		});

		it('changes model status to done when request is complete', function (done) {
			var response = { 'response': 'cellar door' };
			server.respondWith([
				200,
				{ 'Content-Type': 'application/json' },
				JSON.stringify(response)
			]);
			model.request({
				url: url,
				method: 'get',
				success: function () {
					model.status.value.should.equal(nx.AsyncStatus.DONE);
					done();
				}
			});
			server.respond();
		});

		it('changes model status to error when request fails', function (done) {
			var response = { 'error': 'not found' };
			server.respondWith([
				404,
				{ 'Content-Type': 'application/json' },
				JSON.stringify(response)
			]);
			model.request({
				url: url,
				method: 'get',
				error: function () {
					model.status.value.should.equal(nx.AsyncStatus.ERROR);
					done();
				}
			});
			server.respond();
		});
	});
});
