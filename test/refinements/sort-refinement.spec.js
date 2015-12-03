var nx = {
	Cell: require('../../src/core/cell'),
	Collection: require('../../src/core/collection'),
	Command: require('../../src/core/command'),
	SortRefinement: require('../../src/refinements/sort-refinement'),
	LiveTransform: require('../../src/core/live-transform'),
	RefinedCollection: require('../../src/refinements/refined-collection')
};

describe('nx.SortRefinement', function () {
	'use strict';

	var collection;
	var refined;
	var refinement;

	var Model = function (value) {
		return { text: new nx.Cell({ value: value }) };
	};

	beforeEach(function () {
		collection = new nx.Collection({
			items: [4, 3, 5, 1, 2].map(Model),
			transform: nx.LiveTransform(['text'])
		});

		var compare = function (firstValues, secondValues) {
			return secondValues[0] - firstValues[0];
		};

		refinement = new nx.SortRefinement({
			values: ['text'],
			compare: compare,
			source: collection
		});

		refined = new nx.RefinedCollection(collection, refinement, '->>');
	});

	describe('append', function () {
		it('it inserts items at appropriate positions', function () {
			var items = [6].map(Model);
			var values = items.map(refinement.values.bind(refinement));
			refined.command.value = refinement.append({ items: items }, values);
			refined.items
				.map(function (item) { return item.text.value; })
				.should.deep.equal([6, 5, 4, 3, 2, 1]);

			refined.command.value.should.deep.equal([
				new nx.Command('insertBefore', {
					index: 0,
					items: [6].map(Model)
				})
			]);
		});
	});

	describe('insertBefore', function () {
		it('it inserts items at appropriate positions', function () {
			var items = [0.5, 0.75].map(Model);
			var values = items.map(refinement.values.bind(refinement));

			refined.command.value = refinement.insertBefore({ index: 1, items: items }, values);
			refined.items
				.map(function (item) { return item.text.value; })
				.should.deep.equal([5, 4, 3, 2, 1, 0.75, 0.5]);

			refined.command.value.should.deep.equal([
				new nx.Command('append', { items: [0.5].map(Model) }),
				new nx.Command('insertBefore', {
					index: 5,
					items: [0.75].map(Model)
				})
			]);
		});
	});

	describe.skip('remove', function () {
		it('removes items from the refined collection after applying the filter', function () {
			refined.command.value = refinement.remove({ indexes: [1] });
			refined.items.map(function (item) { return item.text.value; }).should.deep.equal([1, 3, 5]);
			refinement._indexes.should.deep.equal([0, 2, 4]);
			refined.command.value = refinement.remove({ indexes: [2] });
			refined.items.map(function (item) { return item.text.value; }).should.deep.equal([1, 5]);
			refined.command.value.should.deep.equal(
				new nx.Command('remove', { indexes: [1] })
			);
			refinement._indexes.should.deep.equal([0, 4]);
		});
	});

	describe('reset', function () {
		it('applies filter and resets the refined collection', function () {
			var items = [11, 13, 14, 10, 12].map(Model);
			var values = items.map(refinement.values.bind(refinement));
			refined.command.value = refinement.reset({ items: items }, values);
			refined.items
				.map(function (item) { return item.text.value; })
				.should.deep.equal([14, 13, 12, 11, 10]);
			refined.command.value.should.deep.equal(
				new nx.Command('reset', { items: [14, 13, 12, 11, 10].map(Model) })
			);
		});
	});

	describe('swap', function () {
	});

	describe('change', function () {
	});
});
