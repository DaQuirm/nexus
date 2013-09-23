describe('nx.RestCollection', function() {

	describe('constructor', function() {
		it('creates a new collection model instance based on a URL', function() {
			var url = 'http://localhost/users';
			var model = new nx.RestCollection({ url: url });
			model.url.should.equal(url);
		});
	});

	describe('retrieve', function() {
		it('gets collection data with a GET request', function() {
			var model = new nx.RestCollection({ url: url })
		})
	});

	describe('save', function() {

	});

	describe('delete', function() {

	});

});
