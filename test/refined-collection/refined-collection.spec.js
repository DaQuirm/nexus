describe('nx.RefinedCollection', function () {
	'use strict';

	describe('constructor', function () {
		it('accepts an nx.Collection instance as the first parameter ant stores it', function () {
			var collection = new nx.Collection();
			var refined = new nx.RefinedCollection(
				collection,
				{ filter: function (item) { return item & 1; } }
			);
			refined.collection.should.equal(collection);
		});

		it('accepts refinement options and creates refinement objects', function () {
			var collection = new nx.Collection({ items: [1, 2, 3, 4, 5] });
			var refinement = { filter: function (item) { return item & 1; } };
			var refined = new nx.RefinedCollection(collection, refinement);
			refined._refinement.should.be.an.instanceOf(nx.FilterRefinement);
			refined.items.should.deep.equal([1, 3, 5]);
			refined.refinement.value.should.equal(refinement);
		});
	});

	describe('refinement', function () {
		it('is an nx.Cell that contains the refinement object', function () {
			var collection = new nx.Collection();
			var refined = new nx.RefinedCollection(
				collection,
				{ filter: function (item) { return item & 1; } }
			);
			refined.refinement.should.be.an.instanceOf(nx.Cell);
		});

		it('reapplies new refinement when changed', function () {
			var collection = new nx.Collection({ items: [1, 2, 3, 4, 5] });
			var refinement = { filter: function (item) { return item & 1; } };
			var refined = new nx.RefinedCollection(collection, refinement);
			refined.refinement.value = { filter: function (item) { return item > 2; } };
			refined.items.should.deep.equal([3, 4, 5]);
		});

		it('emits a Content.reset command when changed', function () {
			var collection = new nx.Collection({ items: [1, 2, 3, 4, 5] });
			var refinement = { filter: function (item) { return item & 1; } };
			var refined = new nx.RefinedCollection(collection, refinement);
			refined.refinement.value = { filter: function (item) { return item > 2; } };
			refined.event.value.should.deep.equal(
				new nxt.Command('Content', 'reset', { items: [3, 4, 5] })
			);
		});
	});

});
