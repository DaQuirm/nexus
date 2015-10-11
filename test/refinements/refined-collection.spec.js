var nx = {
	Cell: require('../../src/core/cell'),
	Collection: require('../../src/core/collection'),
	Command: require('../../src/core/command'),
	Identity: require('../../src/core/identity'),
	LiveTransform: require('../../src/core/live-transform'),
	RefinedCollection: require('../../src/refinements/refined-collection'),
	Refinement: require('../../src/refinements/refinement')
};

describe('nx.RefinedCollection', function () {
	'use strict';

	describe('constructor', function () {
		it('accepts an nx.Collection source as the first parameter and stores it', function () {
			var collection = new nx.Collection();
			var refined = new nx.RefinedCollection(
				collection,
				new nx.Refinement({ values: function () {} })
			);
			refined.source.should.equal(collection);
		});

		it('accepts a refinement as the second parameter and stores it', function () {
			var collection = new nx.Collection();
			var refinement = new nx.Refinement({ values: function () {} });
			var refined = new nx.RefinedCollection(collection, refinement);
			refined.refinement.value.should.equal(refinement);
		});

		/* eslint-disable max-len */
		it('creates a binding with source collection\'s command cell and calls refinement\'s `refine` method', function () {
		/* eslint-enable */
			var collection = new nx.Collection();
			var refinement = new nx.Refinement({ values: function () {} });
			refinement.refine = nx.Identity;
			var refineSpy = sinon.spy(refinement, 'refine');
			var refined = new nx.RefinedCollection(collection, refinement);
			collection.append(1);
			refineSpy.should.have.been.calledWith(collection.command.value);
			refined.command.value.should.deep.equal(refinement.refine(collection.command.value));
			refineSpy.restore();
		});

		/* eslint-disable max-len */
		it('creates a binding to the LiveTransform\'s `change` cell and calls refinement\'s `live` method', function () {
		/* eslint-enable */
			var collection = new nx.Collection({
				transform: nx.LiveTransform(['name']),
				items: [
					{ name: new nx.Cell({ value: 'Douglas Spaulding' }) }
				]
			});
			var refinement = new nx.Refinement({ values: function () {} });
			refinement.live = function (change) {
				return new nx.Command('reset', { items: [change.item] });
			};
			var refined = new nx.RefinedCollection(collection, refinement);
			var liveSpy = sinon.spy(refinement, 'live');
			collection.items[0].name.value = 'Tom Spaulding';
			liveSpy.should.have.been.calledWith(collection.transform.change.value);
			refined.command.value.should.deep.equal(refinement.live(collection.transform.change.value));
			liveSpy.restore();
		});
	});

	describe('refinement', function () {
		it.skip('reapplies new refinement when changed', function () {
			var collection = new nx.Collection({ items: [1, 2, 3, 4, 5] });
			var refinement = { filter: function (item) { return item & 1; } };
			var refined = new nx.RefinedCollection(collection, refinement);
			refined.refinement.value = { filter: function (item) { return item > 2; } };
			refined.items.should.deep.equal([3, 4, 5]);
		});

		it.skip('emits a `reset` command when changed', function () {
			var collection = new nx.Collection({ items: [1, 2, 3, 4, 5] });
			var refinement = { filter: function (item) { return item & 1; } };
			var refined = new nx.RefinedCollection(collection, refinement);
			refined.refinement.value = { filter: function (item) { return item > 2; } };
			refined.event.value.should.deep.equal(
				// new nxt.Command('Content', 'reset', { items: [3, 4, 5] })
			);
		});
	});

});
