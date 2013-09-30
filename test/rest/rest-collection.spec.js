describe('nx.RestCollection', function() {

	describe('constructor', function() {
		it('creates a new collection model instance based on a URL', function() {
			var url = 'http://localhost/users';
			var model = new nx.RestCollection({ url: url });
			model.url.should.equal(url);
		});

		it('accepts a rest document model constructor for collection item instantiation', function() {
			var UserModel = Object.create(nx.RestDocument);
			var model = new nx.RestCollection({ url: url, item:  });
		});
	});

	describe('create', function() {

	});
});
