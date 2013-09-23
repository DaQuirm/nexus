describe('nx.RestDocument', function() {

	var url = 'http://localhost/users/1';

	beforeEach(function() {
		var model = new nx.RestDocument({ url: url });
	});

	describe('constructor', function() {
		it('creates a new document model instance based on a URL', function() {
			model.url.should.equal(url);
		});
	});

	describe('data', function() {
		it('is an nx.Property that holds document data', function() {
			model.data.should.be.an.instanceOf(nx.Property);
		});
	});

	describe('retrieve', function() {
		it('asynchronously gets document data with a GET request', function(done) {
			model.retrieve(function(data) {
				data.should.be.json;
				model.data.value.shoul.deep.equal(data);
				done();
			});
		})
	});

	describe('save', function() {
		it('asynchronously updates document data with a PUT request', function(done) {
			model.retrieve(function(data) {
				data.should.be.json;
				model.data.value.shoul.deep.equal(data);
				done();
			});
		}
	});

	describe('delete', function() {
		it('deletes document data with a DELETE request', function(done) {
			model.retrieve(function(data) {
				data.should.be.json;
				model.data.value.shoul.deep.equal(data);
				done();
			});
		}
	});

});
