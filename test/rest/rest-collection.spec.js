describe('nx.RestCollection', function() {

	var url = 'http://localhost/users/';
	var UserModel = nx.RestDocument;

	beforeEach(function() {
		xhr = sinon.useFakeXMLHttpRequest();
		model = new nx.RestDocument({ url: url });
		server = sinon.fakeServer.create();
	});

	afterEach(function() {
		xhr.restore && xhr.restore();
		server.restore();
	});

	describe('constructor', function() {
		it('creates a new collection model instance based on a URL', function() {
			var collection = new nx.RestCollection({ url: url });
			collection.options.url.should.equal(url);
		});

		it('accepts a rest document model constructor for collection item instantiation', function() {
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			collection.options.item.should.equal(UserModel);
		});
	});

	describe('items', function() {
		it('is an nx.Collection instance', function() {
			var collection = new nx.RestCollection({ url: url });
			collection.items.should.be.an.instanceOf(nx.Collection);
			collection.items.items.should.be.empty;
		});
	});

	describe('create', function() {
		it('adds a model instance to the collection model with a POST request', function(done) {
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			var request_spy = sinon.spy(nx.RestDocument.prototype, 'request');
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
				{ "Content-Type": "application/json" },
				JSON.stringify(response)
			]);
			collection.create(item, function(data) {
				var requestOptions = request_spy.lastCall.args[0];
				requestOptions.should.have.property('method', 'post');
				data.should.deep.equal(response);
				item.data.value.should.deep.equal(data);
				nx.RestDocument.prototype.request.restore();
				done();
			});
			server.respond();
		});
	});

	describe('retrieve', function() {

		it('asynchronously gets collection data with a GET request', function(done) {
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			var request_spy = sinon.spy(collection, 'request');
			var response = [
				{ firstname: 'Samuel', lastname: 'Vimes' },
				{ firstname: 'Fred', lastname: 'Colon' }
			];
			server.respondWith([
				200,
				{ "Content-Type": "application/json" },
				JSON.stringify(response)
			]);
			collection.retrieve(function(items) {
				items.items.should.have.length(2);
				collection.items.should.deep.equal(items);
				var requestOptions = request_spy.lastCall.args[0];
				requestOptions.should.have.property('url', url);
				requestOptions.should.have.property('method', 'get');
				done();
			});
			server.respond();
		});

		it('converts collection data into an items array using item constructor', function(done) {
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			var response = [
				{ firstname: 'Samuel', lastname: 'Vimes' },
				{ firstname: 'Fred', lastname: 'Colon' }
			];
			server.respondWith([
				200,
				{ "Content-Type": "application/json" },
				JSON.stringify(response)
			]);
			collection.retrieve(function(items) {
				collection.items.items.should.have.length(2);
				collection.items.items[1].data.value.should.deep.equal(response[1]);
				done();
			});
			server.respond();
		});
	});
});
