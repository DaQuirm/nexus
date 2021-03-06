var nx = {
	Cell: require('../../src/core/cell'),
	Collection: require('../../src/core/collection'),
	Command: require('../../src/core/command'),
	FilterRefinement: require('../../src/refinements/filter-refinement'),
	LiveTransform: require('../../src/core/live-transform'),
	RefinedCollection: require('../../src/refinements/refined-collection')
};

describe('nx.FilterRefinement', function () {
	'use strict';

	var collection;
	var refined;
	var refinement;
	var filter;

	var Model = function (value) {
		return { text: new nx.Cell({ value: value }) };
	};

	beforeEach(function () {
		collection = new nx.Collection({
			transform: nx.LiveTransform(['text']),
			items: [1, 2, 3, 4, 5].map(Model)
		});

		filter = function (value) { return value & 1; };

		refinement = new nx.FilterRefinement({
			values: ['text'],
			filter: filter,
			source: collection
		});

		refined = new nx.RefinedCollection(collection, refinement, '->>');
	});

	describe('append', function () {
		it('it appends items to the refined collection after applying the filter', function () {
			var items = [6, 7].map(Model);
			collection.append.apply(collection, items);
			refined.items.map(function (item) { return item.text.value; }).should.deep.equal([1, 3, 5, 7]);
			refined.command.value.should.deep.equal(
				new nx.Command('append', { items: [7].map(Model) })
			);
			refinement._indexes.should.deep.equal([0, 2, 4, 6]);
		});
	});

	describe('insertBefore', function () {
		it('is inserts items to appropriate positions after applying the filter', function () {
			var items = [Model(9)];
			collection.insertBefore(collection.items[2], items);
			refined.items.map(function (item) { return item.text.value; }).should.deep.equal([1, 9, 3, 5]);
			refined.command.value.should.deep.equal(
				new nx.Command('insertBefore', {
					items: [9].map(Model),
					index: 1
				})
			);
			refinement._indexes.should.deep.equal([0, 2, 3, 5]);
		});

		it('returns an append command if the insert reference is at the end of the filtered collection', function () {
			collection.append(Model(6));
			var items = [6, 7].map(Model);
			collection.insertBefore(collection.items[5], items);
			refined.items.map(function (item) { return item.text.value; }).should.deep.equal([1, 3, 5, 7]);
			refined.command.value.should.deep.equal(
				new nx.Command('append', { items: [7].map(Model) })
			);
			refinement._indexes.should.deep.equal([0, 2, 4, 7]);
		});
	});

	describe('remove', function () {
		it('removes items from the refined collection after applying the filter', function () {
			collection.remove(collection.items[1]);
			refined.items.map(function (item) { return item.text.value; }).should.deep.equal([1, 3, 5]);
			refinement._indexes.should.deep.equal([0, 2, 4]);
			collection.remove(collection.items[2]);
			refined.items.map(function (item) { return item.text.value; }).should.deep.equal([1, 5]);
			refined.command.value.should.deep.equal(
				new nx.Command('remove', { indexes: [1] })
			);
			refinement._indexes.should.deep.equal([0, 3]);
		});
	});

	describe('reset', function () {
		it('applies filter and resets the refined collection', function () {
			var items = [10, 11, 12, 13, 14].map(Model);
			collection.reset(items);
			refined.items.map(function (item) { return item.text.value; }).should.deep.equal([11, 13]);
			refined.command.value.should.deep.equal(
				new nx.Command('reset', { items: [11, 13].map(Model) })
			);
			refinement._indexes.should.deep.equal([1, 3]);
		});
	});

	describe('swap', function () {
		it.skip('applies the command to the refined collection', function () {
			refined.command.value = refinement.swap({ indexes: [1, 4] });
			refined.items.map(function (item) { return item.text.value; }).should.deep.equal([1, 5, 3]);
			refined.command.value.should.deep.equal(
				new nx.Command('swap', { indexes: [1, 2] })
			);
		});
	});

	describe('change', function () {
		it('removes the item from the refined collection if it no longer passes the filter', function () {
			collection.items[2].text.value = '6';
			refined.items.map(function (item) { return item.text.value; }).should.deep.equal([1, 5]);
			refined.command.value.should.deep.equal(
				new nx.Command('remove', { indexes: [2] })
			);
			refinement._indexes.should.deep.equal([0, 4]);
		});

		it('adds the item to the refined collection if it passes the filter', function () {
			collection.items[1].text.value = '7';
			refined.items.map(function (item) { return item.text.value; }).should.deep.equal([1, 7, 3, 5]);
			refined.command.value.should.deep.equal(
				new nx.Command('insertBefore', { indexes: [1], items: [7].map(Model) })
			);
			refinement._indexes.should.deep.equal([0, 1, 2, 4]);
		});

		it('generates an empty command if an item remains filtered', function () {
			collection.items[1].text.value = '8';
			refined.items.map(function (item) { return item.text.value; }).should.deep.equal([1, 3, 5]);
			refined.command.value.should.deep.equal(
				new nx.Command('remove', { indexes: [] })
			);
			refinement._indexes.should.deep.equal([0, 2, 4]);
		});

		it('generates an empty command if an item remains unfiltered', function () {
			collection.items[2].text.value = '7';
			refined.items.map(function (item) { return item.text.value; }).should.deep.equal([1, 7, 5]);
			refined.command.value.should.deep.equal(
				new nx.Command('remove', { indexes: [] })
			);
			refinement._indexes.should.deep.equal([0, 2, 4]);
		});
	});
});
