var nx = {
	RestCollection: require('../../src/rest/rest-collection'),
	RestDocument: require('../../src/rest/rest-document'),
	Utils: require('../../src/core/utils')
};

describe('nx.RestCollection', function () {

	var xhr, server;
	var url = 'http://localhost/users/';

	var UserModel = function (data) {
		nx.RestDocument.call(this, { url: url, data: data });
	};
	nx.Utils.mixin(UserModel.prototype, nx.RestDocument.prototype);

	beforeEach(function () {
		xhr = sinon.useFakeXMLHttpRequest();
		server = sinon.fakeServer.create();
	});

	afterEach(function () {
		if (xhr.restore) {
			xhr.restore();
		}
		server.restore();
	});

	describe('constructor', function () {
		it('creates a new collection model instance based on a URL', function () {
			var collection = new nx.RestCollection({ url: url });
			collection.options.url.should.equal(url);
		});

		it('accepts a rest document model constructor for collection item instantiation', function () {
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			collection.options.item.should.equal(UserModel);
		});
	});

	describe('create', function () {
		it('adds a model instance to the collection model with a POST request', function (done) {
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			var requestSpy = sinon.spy(nx.RestDocument.prototype, 'request');
			var itemData = {
				firstname: 'Samuel',
				lastname: 'Vimes'
			};
			var item = new nx.RestDocument({ data: itemData });
			var response = {
				id: 0,
				firstname: 'Samuel',
				lastname: 'Vimes'
			};
			server.respondWith([
				200,
				{ 'Content-Type': 'application/json' },
				JSON.stringify(response)
			]);
			collection.create(item, function (data) {
				var requestOptions = requestSpy.lastCall.args[0];
				requestOptions.should.have.property('method', 'post');
				data.should.deep.equal(response);
				item.data.value.should.deep.equal(data);
				nx.RestDocument.prototype.request.restore();
				done();
			});
			server.respond();
		});
	});

	describe('retrieve', function () {

		it('asynchronously gets collection data with a GET request', function (done) {
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			var requestSpy = sinon.spy(collection, 'request');
			var response = [
				{ firstname: 'Samuel', lastname: 'Vimes' },
				{ firstname: 'Fred', lastname: 'Colon' }
			];
			server.respondWith([
				200,
				{ 'Content-Type': 'application/json' },
				JSON.stringify(response)
			]);
			collection.retrieve(function (items) {
				items.should.have.length(2);
				collection.items.should.deep.equal(items);
				var requestOptions = requestSpy.lastCall.args[0];
				requestOptions.should.have.property('method', 'get');
				done();
			});
			server.respond();
		});

		it('converts collection data into an items array using item constructor', function (done) {
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			var response = [
				{ firstname: 'Samuel', lastname: 'Vimes' },
				{ firstname: 'Fred', lastname: 'Colon' }
			];
			server.respondWith([
				200,
				{ 'Content-Type': 'application/json' },
				JSON.stringify(response)
			]);
			collection.retrieve(function () {
				collection.items.should.have.length(2);
				collection.items[1].data.value.should.deep.equal(response[1]);
				done();
			});
			server.respond();
		});
	});

	describe('remove', function (done) {
		/* eslint-disable max-len */
		it('calls the `remove` method of a document and removes it from the collection if request succeeds', function () {
		/* eslint-enable */
			var collection = new nx.RestCollection({
				url: url,
				item: UserModel,
				items: [
					new UserModel({ firstname: 'Samuel', lastname: 'Vimes' }),
					new UserModel({ firstname: 'Fred', lastname: 'Colon' })
				]
			});
			var fred = collection.items[1];
			collection.remove(fred, function () {
				/* eslint-disable no-unused-expressions */
				fred.remove.should.have.been.called;
				/* eslint-enable */
				server.requests.length.should.equal(1);
				server.requests[0].url.should.equal(url);
				server.requests[0].method.should.equal('delete');
				collection.items.should.not.contain(fred);
				done();
			});
		});
	});
});
