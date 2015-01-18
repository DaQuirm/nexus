describe('nx.FilterRefinement', function () {
	'use strict';

	var collection;
	var refined;
	var refinement;

	beforeEach(function () {
		collection = new nx.Collection({ items: [1, 2, 3, 4, 5] });
		var filter = function (item) { return item & 1; };
		refined = new nx.RefinedCollection(collection, { filter: filter });
		refinement = refined._refinement;
	});

	describe('constructor', function () {
		it('creates a refinement instance and stores a reference to the refined collection', function () {
			refinement.refined.should.equal(refined);
			refinement.collection.should.equal(refined.collection);
		});
	});

	describe('append', function () {
		it('it appends items to the refined collection after applying the filter', function () {
			refinement.append({ items: [6, 7] });
			refined.items.should.deep.equal([1, 3, 5, 7]);
			refined.event.value.should.deep.equal(
				new nxt.Command('Content', 'append', { items: [7] })
			);
		});
	});

	describe('insertBefore', function () {
		it('is inserts items to appropriate positions after applying the filter', function () {
			refinement.insertBefore({ items: [9], index: 2 });
			refined.items.should.deep.equal([1, 9, 3, 5]);
			refined.event.value.should.deep.equal(
				new nxt.Command('Content', 'insertBefore', {
					items: [9],
					index: 1
				})
			);
			collection.append(6);
			refinement.insertBefore({ items: [6, 7], index: 5 });
			refined.items.should.deep.equal([1, 9, 3, 5, 7]);
			refined.event.value.should.deep.equal(
				new nxt.Command('Content', 'append', { items: [7] })
			);
		});
	});

	describe('remove', function () {
		it('removes items from the refined collection after applying the filter', function () {
			refinement.remove({ items: [2], indexes: [1] });
			refined.items.should.deep.equal([1, 3, 5]);
			refinement.remove({ items: [3], indexes: [2] });
			refined.items.should.deep.equal([1, 5]);
			refined.event.value.should.deep.equal(
				new nxt.Command('Content', 'remove', { items: [3], indexes: [1] })
			);
		});
	});

	describe('reset', function () {
		it('applies filter and resets the refined collection', function () {
			refinement.reset({ items: [10, 11, 12, 13, 14] });
			refined.items.should.deep.equal([11, 13]);
			refined.event.value.should.deep.equal(
				new nxt.Command('Content', 'reset', { items: [11, 13] })
			);
		});
	});

});
