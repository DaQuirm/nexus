describe('nx.Cell', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a cell instance', function() {
			var cell = new nx.Cell();
			cell.should.be.an('object');
			cell.should.be.an.instanceof(nx.Cell);
		});

		it('can be initialized with the `value` option', function () {
			var cell = new nx.Cell({value:'cellar door'});
			cell.value.should.equal('cellar door');
		});

		it('accepts a side-effect action function', function () {
			var spy = sinon.spy();
			var cell = new nx.Cell({ action: spy });
			cell.value = 'cellar door';
			spy.should.have.been.calledWith('cellar door');
			var anotherCell = new nx.Cell();
			cell.bind(anotherCell, '<->');
			anotherCell.value = '^__^';
			spy.should.have.been.calledWith('^__^');
		});

		it('accepts a compare function for comparing values');
	});

	describe('value',function() {
		it('creates an interface for the cell value', function() {
			var cell = new nx.Cell();
			cell.value = 'cellar door';
			cell.value.should.equal('cellar door');
			var val = cell.value;
			val.should.equal('cellar door');
		});
	});

	describe('set', function () {
		it('sets cell value', function () {
			var cell = new nx.Cell();
			cell.set('cellar door');
			cell.value.should.equal('cellar door');
		});

		it('doesn\'t trigger onvalue', function () {
			var p = new nx.Cell();
			var handler = sinon.spy(function(value){
				value.should.equal('cellar door');
			});
			p.onvalue.add(handler);
			p.set('cellar door');
			handler.should.not.have.been.called;
		});
	});

	describe('bind', function() {
		it('connects a cell to another cell and keeps their value synchronized', function() {
			var p = new nx.Cell();
			var q = new nx.Cell();
			p.bind(q, '<->');
			p.value = 'cellar door';
			q.value.should.equal('cellar door');
			q.value = 'echo';
			p.value.should.equal('echo');
		});

		it('returns an nx.Binding instance', function() {
			var p = new nx.Cell();
			var q = new nx.Cell();
			var binding = p.bind(q, '->');
			binding.should.be.an.instanceof(nx.Binding);
		});

		it('syncs cell values from source to target for one-way bindings', function() {
			var p = new nx.Cell({value:'cellar door'});
			var q = new nx.Cell();
			p.bind(q, '->');
			q.value.should.equal('cellar door');
			p = new nx.Cell();
			q = new nx.Cell({value:'cellar door'});
			var binding = p.bind(q, '<-');
			p.value.should.equal('cellar door');
		})

		it('syncs cell values from source to target for two-way bindings', function() {
			var p = new nx.Cell({value:'cellar door'});
			var q = new nx.Cell({value:'test'});
			p.bind(q, '<->');
			q.value.should.equal('cellar door');
			p.value.should.equal('cellar door');
		})
	});

	describe('onvalue', function() {
		it('is an nx.Event instance', function() {
			var p = new nx.Cell();
			p.onvalue.should.be.an.instanceof(nx.Event);
		});

		it('is triggered when value is set and the new value is passed to the event handlers as an argument', function() {
			var p = new nx.Cell();
			var handler = sinon.spy(function(value){
				value.should.equal('cellar door');
			});
			p.onvalue.add(handler);
			p.value = 'cellar door';
			handler.should.have.been.called;
		});
	});

	describe('onsync', function () {
		it('is triggered when cell is synced with another cell', function () {
			var p = new nx.Cell();
			var q = new nx.Cell();
			p.bind(q, '->');
			var handler = sinon.spy();
			q.onsync.add(handler);
			p.value = 'cellar door';
			handler.should.have.been.calledWith('cellar door');

		});

		it('is not triggered when cell value is set', function () {
			var p = new nx.Cell();
			var handler = sinon.spy();
			p.onsync.add(handler);
			p.value = 'cellar door';
			handler.should.not.have.been.called;
		});
	});
});
