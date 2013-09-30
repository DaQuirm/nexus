describe('nx.RestDocument', function() {

	var url = 'http://localhost/users/37';

	beforeEach(function() {
		var model = new nx.RestDocument({ url: url });
	});

	describe('constructor', function() {
		it('creates a new document model instance based on a URL', function() {
			model.url.should.equal(url);
		});

		it('creates a new document model instance based on a data object', function() {
			var data = {
				firstname: 'Samuel',
				lastname: 'Vimes'
			};
			model = new nx.RestDocument({
				url: url,
				data: data
			});
			model.url.should.equal(url);
			model.data.value.should.deep.equal(data);
		});
	});

	describe('data', function() {
		it('is an nx.Property that holds document data', function() {
			model.data.should.be.an.instanceOf(nx.Property);
		});
	});

	describe('retrieve', function() {
		it('asynchronously gets document data with a GET request', function(done) {
			var request_spy = sinon.spy(model.request);
			model.retrieve(function(data) {
				data.should.be.json;
				model.data.value.shoul.deep.equal(data);
				request_spy.should.have.been.caledWith({ url: url, method: 'get' });
				done();
			});
		})
	});

	describe('save', function() {
		it('asynchronously updates document data with a PUT request', function(done) {
			var request_spy = sinon.spy(model.request);
			model.data.value = { name: 'Samuel' };
			model.save(function() {
				request_spy.should.have.been.caledWith({
					url: url,
					method: 'put',
					data: { name: 'Samuel' }
				});
				done();
			});
		}
	});

	describe('delete', function() {
		it('deletes document data with a DELETE request', function(done) {
			var request_spy = sinon.spy(model.request);
			model.delete(function() {
				request_spy.should.have.been.caledWith({ url: url, method: 'delete' });
				done();
			});
		}
	});

});
