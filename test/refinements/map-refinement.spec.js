var nx = {
	Cell: require('../../src/core/cell'),
	Collection: require('../../src/core/collection'),
	Command: require('../../src/core/command'),
	MapRefinement: require('../../src/refinements/map-refinement'),
	LiveTransform: require('../../src/core/live-transform'),
	RefinedCollection: require('../../src/refinements/refined-collection')
};

describe('nx.MapRefinement', function () {
	'use strict';

	var collection;
	var refined;
	var refinement;
	var map;

	var Model = function (value) {
		return { text: new nx.Cell({ value: value }) };
	};

	beforeEach(function () {
		collection = new nx.Collection({
			items: [1, 2, 3, 4, 5].map(Model),
			transform: nx.LiveTransform(['text'])
		});

		map = function (item) {
			return {
				text: new nx.Cell({ value: item.text.value.toString() })
			};
		};

		refinement = new nx.MapRefinement({
			map: map,
			source: collection
		});

		refined = new nx.RefinedCollection(collection, refinement);
	});

	describe('append', function () {
		it('it appends items to the refined collection after applying the mapping', function () {
			var items = [6, 7].map(Model);
			var values = items.map(refinement.values.bind(refinement));
			refined.command.value = refinement.append({ items: items }, values);
			refined.items.should.deep.equal([1, 2, 3, 4, 5, 6, 7].map(Model).map(map));
			refined.command.value.should.deep.equal(
				new nx.Command('append', { items: items.map(map) })
			);
		});
	});

	describe('insertBefore', function () {
		it('is inserts items to appropriate positions after applying the mapping', function () {
			var items = [Model(9)];
			var values = items.map(refinement.values.bind(refinement));
			refined.command.value = refinement.insertBefore({ items: [9].map(Model), index: 2 }, values);
			refined.items.should.deep.equal([1, 2, 9, 3, 4, 5].map(Model).map(map));
			refined.command.value.should.deep.equal(
				new nx.Command('insertBefore', {
					items: [9].map(Model).map(map),
					index: 2
				})
			);
		});
	});

	describe('remove', function () {
		it('removes items from the refined collection', function () {
			refined.command.value = refinement.remove({ indexes: [2] });
			refined.items.should.deep.equal([1, 2, 4, 5].map(Model).map(map));
			refined.command.value.should.deep.equal(
				new nx.Command('remove', { indexes: [2] })
			);
		});
	});

	describe('reset', function () {
		it('applies mapping and resets the refined collection', function () {
			var items = [10, 11, 12, 13, 14].map(Model);
			var values = items.map(refinement.values.bind(refinement));
			refined.command.value = refinement.reset({ items: items }, values);
			refined.items.should.deep.equal(items.map(map));
			refined.command.value.should.deep.equal(
				new nx.Command('reset', { items: items.map(map) })
			);
		});
	});

	describe('swap', function () {
		it('applies the command to the refined collection', function () {
			refined.command.value = refinement.swap({ indexes: [1, 4] });
			refined.items.should.deep.equal([1, 5, 3, 4, 2].map(Model).map(map));
			refined.command.value.should.deep.equal(
				new nx.Command('swap', { indexes: [1, 4] })
			);
		});
	});

	describe('change', function () {
	});
});
