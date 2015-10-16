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

	var refinement;

	beforeEach(function () {
		refinement = new nx.Refinement({ values: function () {} });
		refinement.refine = nx.Identity;
	});

	describe('constructor', function () {
		it('accepts an nx.Collection source as the first parameter and stores it', function () {
			var collection = new nx.Collection();
			var refined = new nx.RefinedCollection(collection, refinement);
			refined.source.should.equal(collection);
		});

		it('accepts a refinement as the second parameter and stores it', function () {
			var collection = new nx.Collection();

			var refined = new nx.RefinedCollection(collection, refinement);
			refined.refinement.value.should.equal(refinement);
		});

		it('applies refinement to existing collection items only if non-lazy binding is passed', function () {
			var collection = new nx.Collection({ items: [1, 2, 3] });
			var refineSpy = sinon.spy(refinement, 'refine');
			var refined = new nx.RefinedCollection(collection, refinement, '->>');
			refineSpy.should.have.been.calledWith(new nx.Command('reset', { items: collection.items }));
			refined.items.should.deep.equal(collection.items);
			refined = new nx.RefinedCollection(collection, refinement);
			refined.items.should.deep.equal([]);
		});

		/* eslint-disable max-len */
		it('creates a binding with source collection\'s command cell and calls refinement\'s `refine` method', function () {
		/* eslint-enable */
			var collection = new nx.Collection();
			var refineSpy = sinon.spy(refinement, 'refine');
			var refined = new nx.RefinedCollection(collection, refinement);
			collection.append(1);
			refineSpy.should.have.been.calledWith(collection.command.value);
			refined.command.value.should.deep.equal(refinement.refine(collection.command.value));
			refineSpy.restore();
		});

		it('creates a binding with refinement\'s command cell and calls refinement\'s `refine` method', function () {
		/* eslint-enable */
			var collection = new nx.Collection();
			var refineSpy = sinon.spy(refinement, 'refine');
			var refined = new nx.RefinedCollection(collection, refinement);
			refinement.command.value = new nx.Command('append', { items: [1] });
			refineSpy.should.have.been.calledWith(refinement.command.value);
			refined.command.value.should.deep.equal(refinement.refine(refinement.command.value));
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
			refinement = { filter: function (item) { return item & 1; } };
			var refined = new nx.RefinedCollection(collection, refinement);
			refined.refinement.value = { filter: function (item) { return item > 2; } };
			refined.items.should.deep.equal([3, 4, 5]);
		});

		it.skip('emits a `reset` command when changed', function () {
			var collection = new nx.Collection({ items: [1, 2, 3, 4, 5] });
			refinement = { filter: function (item) { return item & 1; } };
			var refined = new nx.RefinedCollection(collection, refinement);
			refined.refinement.value = { filter: function (item) { return item > 2; } };
			refined.event.value.should.deep.equal(
				// new nxt.Command('Content', 'reset', { items: [3, 4, 5] })
			);
		});
	});

});
