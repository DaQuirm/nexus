var nx = {
	Cell: require('../../src/core/cell'),
	Collection: require('../../src/core/collection'),
	Command: require('../../src/core/command'),
	Refinement: require('../../src/refinements/refinement')
};

describe('nx.Refinement', function () {
	'use strict';

	describe('constructor', function () {
		it('accepts `values` item transforming function', function () {
			var values = function (item) { return [item.name.value]; };
			var refinement = new nx.Refinement({ values: values, source: new nx.Collection() });
			refinement._values.should.equal(values);
		});

		it('accepts `values` as cell name arrays', function () {
			var values = ['name'];
			var refinement = new nx.Refinement({ values: values, source: new nx.Collection() });
			refinement._values.should.equal(values);
		});

		it('accepts and stores source collection', function () {
			var values = ['name'];
			var source = new nx.Collection();
			var refinement = new nx.Refinement({ values: values, source: source });
			refinement._source.should.equal(source);
		});

		it('creates cells that reset the refinement on update by their names', function () {
			var source = new nx.Collection();
			var refinement = new nx.Refinement({
				source: source,
				resetters: {
					filter: 'cellar',
					compare: 'door'
				}
			});
			refinement.reset = sinon.spy();

			refinement.filter.should.be.an.instanceof(nx.Cell);
			refinement.filter.value.should.equal('cellar');
			refinement.filter.value = 'cellar door';
			refinement.reset.should.have.been.calledWith({ items: source.items }, source.items);

			refinement.compare.should.be.an.instanceof(nx.Cell);
			refinement.compare.value.should.equal('door');
			refinement.compare.value = 'cellar door';
			refinement.reset.should.have.been.calledWith({ items: source.items }, source.items);
		});

		it('binds a cell to a resetter if it is passed instead of a resetter\'s value', function () {
			var source = new nx.Collection();
			var cell = new nx.Cell();
			var refinement = new nx.Refinement({
				source: source,
				resetters: {
					filter: cell,
					compare: 'door'
				}
			});
			cell.value = 'cellar door';
			refinement.filter.value.should.equal('cellar door');
		});
	});

	describe('values', function () {
		it('applies values selector to a collection item', function () {
			var item = { text: new nx.Cell({ value: 'cellar door' }) };
			var refinement = new nx.Refinement({ values: ['text'] });
			var values = refinement.values(item);
			values.should.deep.equal(['cellar door']);
		});

		it('returns the item itself when no `values` option was passed to the constructor', function () {
			var item = { text: new nx.Cell({ value: 'cellar door' }) };
			var refinement = new nx.Refinement();
			var values = refinement.values(item);
			values.should.equal(item);
		});
	});

	describe('refine', function () {
		it('applies the `values` method to the command items', function () {
			var refinement = new nx.Refinement({ values: ['text'] });
			refinement.reset = function () { return 'cellar door'; };
			var valuesSpy = sinon.spy(refinement, 'values');
			var command = new nx.Command('reset', {
				items: [
					{ text: new nx.Cell({ value: 'cellar' }) },
					{ text: new nx.Cell({ value: 'door' }) }
				]
			});
			refinement.refine(command);
			valuesSpy.getCall(0).should.have.been.calledWith(command.data.items[0]);
			valuesSpy.getCall(1).should.have.been.calledWith(command.data.items[1]);
			valuesSpy.restore();
		});

		it('calls refinement\'s method corresponding to commands method if there is one', function () {
			var refinement = new nx.Refinement({ values: ['text'] });
			refinement.reset = function () { return 'cellar door'; };
			var resetSpy = sinon.spy(refinement, 'reset');
			var command = new nx.Command('reset', {
				items: [
					{ text: new nx.Cell({ value: 'cellar' }) },
					{ text: new nx.Cell({ value: 'door' }) }
				]
			});
			var refined = refinement.refine(command);
			var values = command.data.items.map(refinement.values.bind(refinement));
			resetSpy.should.have.been.calledWith(command.data, values);
			refined.should.deep.equal(refinement.reset(command.data, values));
			resetSpy.restore();
		});
	});

	describe('live', function () {
		it('extracts values and calls the `change` method if there is one', function () {
			var refinement = new nx.Refinement({ values: ['text'] });
			refinement.change = function () { return 'cellar door'; };
			var changeSpy = sinon.spy(refinement, 'change');
			var change = {
				item: { text: new nx.Cell({ value: 'cellar door' }) },
				cell: 'text',
				value: 'cellar door'
			};
			var refined = refinement.live(change);
			var values = refinement.values(change.item);
			changeSpy.should.have.been.calledWith(change, values);
			refined.should.deep.equal(refinement.change(change, values));
			changeSpy.restore();
		});
	});

});
