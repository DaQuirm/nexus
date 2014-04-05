describe('nx.RestCollection', function() {

	var url = 'http://localhost/users/';
	var UserModel = nx.RestDocument;

	describe('constructor', function() {
		it('creates a new collection model instance based on a URL', function() {
			var collection = new nx.RestCollection({ url: url });
			collection.url.should.equal(url);
		});

		it('accepts a rest document model constructor for collection item instantiation', function() {
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			collection.item.should.equal(UserModel);
		});
	});

	describe('create', function() {
		it('adds a model instance to the collection model with a POST request', function(done) {
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			var request_spy = sinon.spy(collection.request);
			var data = {
				firstname: 'Samuel',
				lastname: 'Vimes'
			};
			var item = new nx.RestDocument({ data: data });
			collection.create(item, function() {
				request_spy.should.have.been.caledWith({
					url: url,
					method: 'post',
					data: data
				});
				done();
			});
		});
	});

	describe('retrieve', function() {
		var xhr, requests;

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

		it('asynchronously gets collection data with a GET request', function(done) {
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			var request_spy = sinon.spy(model.request);
			collection.retrieve(function(data) {
				data.should.be.json;
				collection.data.value.shoul.deep.equal(data);
				request_spy.should.have.been.caledWith({ url: url, method: 'get' });
				done();
			});
		});

		it('converts collection data into an items array using item constructor', function(done) {
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			var response = [
				{ firstname: 'Samuel', lastname: 'Vimes' },
				{ firstname: 'Fred', lastname: 'Colon' }
			];
			collection.retrieve(function() {
				collection.items.should.have.length(2);
				collection.items[1].data.value.should.deep.equal(response[1]);
				done();
			});
			server.requests[0].respond(
				200,
				{ "Content-Type": "application/json" },
				JSON.stringify(response)
			);
		});

		it('passes the retrieved data into the callback ', function (done) {
			var response = [
				{ firstname: 'Samuel', lastname: 'Vimes' },
				{ firstname: 'Fred', lastname: 'Colon' }
			];
			var handler = function() {
				handler_spy.should.have.been.calledWith(response);
				done();
			};
			var handler_spy = sinon.spy(handler);
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			collection.retrieve(handler);
			server.requests[0].respond(
				200,
				{ "Content-Type": "application/json" },
				JSON.stringify(response)
			);
		});
	});
});
