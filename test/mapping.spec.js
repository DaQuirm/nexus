describe('nx.Mapping', function() {
	describe('constructor', function() {
		it('creates a mapping', function() {
			var mapping = new nx.Mapping();
			mapping.should.be.an.instanceof('nx.Mapping');
		});
	});

	describe('map', function() {
		it('is an identity function when mapping was created without parameters', function() {
			var identity = new nx.Mapping();
			identity.map({ value: 'cellar door'}).should.equal({ value: 'cellar door'});
		});

		it('maps an object literal to its field', function() {
			var mapping = nx.Mapping({'price':'@'});
			var book = { title:'The Last Hero', price:24.73 }
			mapping.map(book).should.equal(24.73);
		});

		it('maps a value to a field in an object literal', function() {
			var mapping = nx.Mapping({'@':'price'});
			var book = { title:'The Last Hero' }
			mapping.map(price, book);
			book.price.should.equal(24.73);
		});
	});
});