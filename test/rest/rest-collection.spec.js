describe('nx.RestCollection', function() {

	var url = 'http://localhost/news/';

	describe('constructor', function() {
		it('creates a new collection model instance based on a URL', function() {
			var url = 'http://localhost/users';
			var collection = new nx.RestCollection({ url: url });
			collection.url.should.equal(url);
		});

		it('accepts a rest document model constructor for collection item instantiation', function() {
			var UserModel = nx.RestDocument;
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			collection.item.should.equal(UserModel);
		});
	});

	describe('create', function() {
		it('adds a model instance to the collection model with a POST request', function(done) {
			var collection = new nx.RestCollection({ url: url, item: UserModel });
			var request_spy = sinon.spy(collection.request);
			var item = new nx.RestDocument();
			collection.create(item, function() {
				request_spy.should.have.been.caledWith({
					url: url,
					method: 'put',
					data: { name: 'Samuel' }
				});
				done();
			});
		});
	});

	describe('retrieve', function() {
		it('asynchronously gets collection data with a GET request', function(done) {
			var request_spy = sinon.spy(model.request);
			model.retrieve(function(data) {
				data.should.be.json;
				model.data.value.shoul.deep.equal(data);
				request_spy.should.have.been.caledWith({ url: url, method: 'get' });
				done();
			});
		});
	});
});
