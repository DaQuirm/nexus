describe('nx.Mapping', function() {
	describe('constructor', function() {
		it('creates a mapping', function() {
			var mapping = new nx.Mapping();
			mapping.should.be.an.instanceof(nx.Mapping);
		});
	});

	describe('map', function() {
		it('is an identity function when mapping was created without parameters', function() {
			var identity = new nx.Mapping();
			identity.map({ value: 'cellar door'}).should.deep.equal({ value: 'cellar door'});
		});

		it('maps an object literal to its field', function() {
			var mapping = new nx.Mapping({'price':'_'});
			var price = 0;
			var book = { title:'The Last Hero', price:24.73 }
			mapping.map(book, price);
			price.should.equal(24.73);
		});

		it('returns mapping result as well as sets it to the second argument', function() {
			var mapping = new nx.Mapping({'price':'_'});
			var price = 0;
			var book = { title:'The Last Hero', price:24.73 }
			var result = mapping.map(book, price);
			price.should.equal(24.73);
			result.should.equal(price);
		});

		it('maps a value to a field in an object literal', function() {
			var mapping = new nx.Mapping({'_':'price'});
			var price = 24.73;
			var book = { title:'The Last Hero' }
			mapping.map(price, book);
			book.price.should.equal(24.73);
		});
	});
});
