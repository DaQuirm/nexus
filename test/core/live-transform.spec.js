var nx = {
	ArrayTransform: require('../../src/core/array-transform'),
	Cell:           require('../../src/core/cell'),
	Collection:     require('../../src/core/collection'),
	LiveTransform:  require('../../src/core/live-transform')
};

describe('nx.LiveTransform', function () {

	var Model = function (value) {
		return { cell: new nx.Cell({ value: value }) };
	};

	it('initializes the bindings array', function () {
		var transform = nx.LiveTransform(['cell']);
		transform.bindings.should.be.an.instanceof(Array);
		/* eslint-disable no-unused-expressions */
		transform.bindings.should.be.empty;
		/* eslint-enable */
	});

	it('initializes the change cell', function () {
		var transform = nx.LiveTransform(['cell']);
		transform.change.should.be.an.instanceof(nx.Cell);
	});

	describe('cells', function () {

		it('is a function that returns a map of cells to bind to by their names', function () {
			var transform = nx.LiveTransform(['cell']);
			var model = Model('cellar door');
			nx.LiveTransform.cells(transform, model).should.deep.equal({ cell: model.cell });
		});

		it('can be overridden by passing a function to nx.LiveTransform as an argument', function () {
			var spy = sinon.spy();
			var transform = nx.LiveTransform(spy);
			var model = {};
			nx.LiveTransform.cells(transform, model);
			spy.should.have.been.calledWith(model);
		});
	});

	it('calls nx.ArrayTransform and passes command data', function () {
		var transform = nx.LiveTransform(['cell']);
		var models = [1, 2, 3].map(Model);
		var collection = new nx.Collection({ items: models, transform: transform });
		var appendSpy = sinon.spy(nx.ArrayTransform, 'append');
		collection.append(Model(4));
		appendSpy.should.have.been.calledWith(collection.command.value.data, collection.items);
	});

	it('handles bindings for multiple cells correctly', function () {
		var transform = nx.LiveTransform(['day', 'month', 'year']);
		var models = [
			{ day: new nx.Cell(), month: new nx.Cell(), year: new nx.Cell() },
			{ day: new nx.Cell(), month: new nx.Cell(), year: new nx.Cell() },
			{ day: new nx.Cell(), month: new nx.Cell(), year: new nx.Cell() }
		];
		nx.LiveTransform.reset(transform, { items: models });
		models = nx.ArrayTransform.reset({ items: models }, models);
		transform.bindings.length.should.equal(3);
		transform.bindings[0].length.should.equal(3);
		nx.LiveTransform.reset(transform, { items: [] });
		/* eslint-disable no-unused-expressions */
		transform.bindings.should.be.empty;
		/* eslint-enable */
	});

	describe('change', function () {
		it('is a cell that broadcasts binding value changes including item index', function () {
			var transform = nx.LiveTransform(['cell']);
			var models = [
				Model(),
				Model('cellar')
			];
			nx.LiveTransform.reset(transform, { items: models });
			models[1].cell.value = 'door';
			transform.change.value.should.deep.equal({
				item: models[1],
				cell: 'cell',
				value: 'door'
			});
		});
	});

	describe('append', function () {

		var transform, models;

		beforeEach(function () {
			transform = nx.LiveTransform(['cell']);
			models = [
				Model('first')
			];
			var model = Model('second');
			nx.LiveTransform.reset(transform, { items: models });
			models = nx.ArrayTransform.reset({ items: models }, models);
			nx.LiveTransform.append(transform, { items: [model] });
			models = nx.ArrayTransform.append({ items: [model] }, models);
		});

		it('creates and appends cell bindings for the new items', function () {
			transform.bindings.should.have.length(models.length);
			transform.bindings[1][0].source.should.equal(models[1].cell);
		});

		it('binds the `change` cell with designated cells', function () {
			models[1].cell.bindings[0].target.should.equal(transform.change);
		});
	});

	describe('remove', function () {

		var transform, models;

		beforeEach(function () {
			models = [1, 2, 3, 4, 5].map(Model);
			transform = nx.LiveTransform(['cell']);
			nx.LiveTransform.reset(transform, { items: models });
			models = nx.ArrayTransform.reset({ items: models }, models);
			nx.LiveTransform.remove(transform, { indexes: [1, 3] });
		});

		it('removes cell bindings', function () {
			transform.bindings.length.should.equal(3);
		});

		it('unbinds the cells from the `change` cells', function () {
			/* eslint-disable no-unused-expressions */
			models[1].cell.bindings.should.be.empty;
			models[3].cell.bindings.should.be.empty;
			/* eslint-enable */
		});
	});

	describe('insertBefore', function () {
		var transform, models;

		beforeEach(function () {
			transform = nx.LiveTransform(['cell']);
			models = [
				Model('first')
			];
			var model = Model('second');
			nx.LiveTransform.reset(transform, { items: models });
			models = nx.ArrayTransform.reset({ items: models }, models);
			nx.LiveTransform.insertBefore(transform, { index: 0, items: [model] });
			models = nx.ArrayTransform.insertBefore({ items: [model] }, models);
		});

		it('creates and inserts cell bindings for the new items', function () {
			transform.bindings.length.should.equal(models.length);
			models[0].cell.value.should.equal('second');
			transform.bindings[0][0].source.should.equal(models[0].cell);
		});

		it('binds the `change` cell with designated cells', function () {
			models[0].cell.bindings[0].target.should.equal(transform.change);
		});
	});

	describe('reset', function () {

		var transform, models, itemsBefore, itemsAfter;

		beforeEach(function () {
			transform = nx.LiveTransform(['cell']);
			itemsBefore = [Model('before')];
			itemsAfter = [Model('after')];
			models = [];
			nx.LiveTransform.reset(transform, { items: itemsBefore });
			models = nx.ArrayTransform.reset({ items: itemsBefore }, models);
			nx.LiveTransform.reset(transform, { items: itemsAfter });
			models = nx.ArrayTransform.reset({ items: itemsAfter }, models);
		});

		it('replaces cell bindings for all items', function () {
			models[0].cell.value.should.equal('after');
			transform.bindings.length.should.equal(models.length);
			transform.bindings[0][0].source.should.equal(models[0].cell);
		});

		it('unbinds previous items\' bindings', function () {
			/* eslint-disable no-unused-expressions */
			itemsBefore[0].cell.bindings.should.be.empty;
			/* eslint-enable */
		});
	});

	describe('swap', function () {

		var transform, models, items;

		beforeEach(function () {
			transform = nx.LiveTransform(['cell']);
			items = [1, 2].map(Model);
			models = [];
			nx.LiveTransform.reset(transform, { items: items });
			models = nx.ArrayTransform.reset({ items: items }, models);
			nx.LiveTransform.swap(transform, { indexes: [0, 1] });
			models = nx.ArrayTransform.swap({ indexes: [0, 1] }, models);
		});

		it('swaps two sets of cell bindings', function () {
			transform.bindings.length.should.equal(models.length);
			transform.bindings[0][0].source.should.equal(models[0].cell);
			transform.bindings[1][0].source.should.equal(models[1].cell);
		});

	});
});
