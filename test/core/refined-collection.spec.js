describe('nx.RefinedCollection', function () {

	describe('constructor', function () {
		it('accepts an nx.Collection instance as the first parameter ant stores it', function () {
			var collection = new nx.Collection();
			var refined = new nx.RefinedCollection(collection);
			refined.collection.should.equal(collection);
		});

		it('accepts filter refinements', function () {
			var collection = new nx.Collection({ items: [1, 2, 3, 4, 5] });
			var refined = new nx.RefinedCollection(collection, [
				{ filter: function (item) { return item & 1; } }
			]);
			refined.items.should.equal([1, 3, 5]);
		});
	});

	describe('items', function () {
		it('is a read-only property that returns a collection projection based on applied refinements', function () {
			var collection = new nx.Collection({ items: [1, 2, 3, 4, 5] });
			var refined = new nx.RefinedCollection(collection);
			refined.items.should.deep.equal(collection.items);
		});
	});

	describe('refinements', function () {

	});

	// describe('filter', function () {
	// 	it('is an nx.Cell instance that filters collection items with its value function', function () {
	// 		var collection = new nx.Collection();
	// 		var refined = new nx.RefinedCollection(collection);
	// 		refined.filter.should.be.an.instanceOf(nx.Cell);
	// 		refined.filter.value = function (item) { return item & 1; };
	// 		refined.items.should.deep.equal([]);
	// 	});
	// });

});
