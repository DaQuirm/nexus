describe('nx.SortRefinement', function () {
	'use strict';

	var collection;
	var refined;
	var refinement;

	beforeEach(function () {
		collection = new nx.Collection({ items: [4, 3, 5, 1, 2] });
		var comparator = function (firstItem, secondItem) { return secondItem - firstItem; };
		refined = new nx.RefinedCollection(collection, { sort: comparator });
		refinement = refined._refinement;
	});

	describe('constructor', function () {
		it('creates a refinement instance and stores a reference to the refined collection', function () {
			refinement.refined.should.equal(refined);
			refinement.collection.should.equal(refined.collection);
		});
	});

	describe('append', function () {
		it('it inserts items at appropriate positions', function () {
			refinement.append({ items: [6] });
			refined.items.should.deep.equal([6, 5, 4, 3, 2, 1]);
			refined.event.value.should.deep.equal(
				new nxt.Command('Content', 'insertBefore', {
					items: [6],
					index: 0
				})
			);
		});
	});

	describe('insertBefore', function () {
		it('it inserts items at appropriate positions', function () {
			var appendSpy = sinon.spy(refined, 'append');
			var insertBeforeSpy = sinon.spy(refined, 'insertBefore');

			refinement.insertBefore({ index: 1, items: [0.5, 0.75] });
			refined.items.should.deep.equal([5, 4, 3, 2, 1, 0.75, 0.5]);

			appendSpy.should.have.been.calledWith(0.5);
			insertBeforeSpy.should.have.been.calledWith(0.5, 0.75);

			appendSpy.restore();
			insertBeforeSpy.restore();
		});
	});

	describe('remove', function () {
		it('removes items at appropriate positions', function () {
			refinement.remove({ indexes: [1], items:[collection.items[1]] });
			refined.items.should.deep.equal([5, 4, 2, 1]);
			refined.event.value.should.deep.equal(
				new nxt.Command('Content', 'remove', {
					items: [3],
					indexes: [2]
				})
			);
		});
	});

	describe('reset', function () {
		it('is applied whenever the original collection is reset', function () {
			refinement.reset({ items: [11, 13, 14, 10, 12] });
			refined.items.should.deep.equal([14, 13, 12, 11, 10]);
			refined.event.value.should.deep.equal(
				new nxt.Command('Content', 'reset', { items: [14, 13, 12, 11, 10] })
			);
		});
	});

});
