var nx = {
	Binding: require('../../src/core/binding'),
	Cell: require('../../src/core/cell'),
	Event: require('../../src/core/event'),
	Mapping: require('../../src/core/mapping')
};

describe('nx.Cell', function () {
	'use strict';

	describe('constructor', function () {
		it('creates a cell instance', function () {
			var cell = new nx.Cell();
			cell.should.be.an('object');
			cell.should.be.an.instanceof(nx.Cell);
		});

		it('can be initialized with the `value` option', function () {
			var cell = new nx.Cell({ value: 'cellar door' });
			cell.value.should.equal('cellar door');
		});

		it('accepts a side-effect action function', function () {
			var spy = sinon.spy();
			var cell = new nx.Cell({ action: spy });
			cell.value = 'cellar door';
			spy.should.have.been.calledWith('cellar door');
			var anotherCell = new nx.Cell();
			cell['<->'](anotherCell);
			anotherCell.value = '^__^';
			spy.should.have.been.calledWith('^__^');
		});

		it('accepts binding data and transforms it into binding method calls', function () {
			var target = new nx.Cell();
			var cell = new nx.Cell({
				'->': [target, function (value) { return -value; }]
			});
			cell.value = 10;
			target.value.should.equal(-10);
			var cellA = new nx.Cell();
			var cellB = new nx.Cell();
			cell = new nx.Cell({
				'<-': [[cellA, cellB], function (a, b) { return a + ' ' + b; }]
			});
			cellA.value = 'cellar';
			cellB.value = 'door';
			cell.value.should.equal('cellar door');
		});

		it('accepts a compare function for comparing values');
	});

	describe('value', function () {
		it('creates an interface for the cell value', function () {
			var cell = new nx.Cell();
			cell.value = 'cellar door';
			cell.value.should.equal('cellar door');
			var val = cell.value;
			val.should.equal('cellar door');
		});

		it('prevents twin bindings from syncing by locking them', function () {
			var p = new nx.Cell({ value: 'p' });
			var q = new nx.Cell({ value: 'q' });
			var conversion = sinon.spy();
			var backConversion = sinon.spy();
			p['<->'](q, conversion, backConversion);
			p.value = '!';
			/* eslint-disable no-unused-expressions */
			backConversion.should.not.have.been.called;
			/* eslint-enable */
		});

		it('unlocks twin bindings after syncing', function () {
			var p = new nx.Cell({ value: 'p' });
			var q = new nx.Cell({ value: 'q' });
			var conversion = sinon.spy();
			var backConversion = sinon.spy();
			var bindings = p['<->'](q, conversion, backConversion);
			var backBinding = bindings[1];
			p.value = '!';
			backBinding.locked.should.equal(false);
		});
	});

	describe('binding methods', function () {

		var they = it;

		they('connect a cell to another cell and keeps their value synchronized', function () {
			var p = new nx.Cell();
			var q = new nx.Cell();
			p['<->'](q);
			p.value = 'cellar door';
			q.value.should.equal('cellar door');
			q.value = 'echo';
			p.value.should.equal('echo');
		});

		they('return an nx.Binding instance', function () {
			var p = new nx.Cell();
			var q = new nx.Cell();
			var binding = p['->'](q);
			binding.should.be.an.instanceof(nx.Binding);
		});

		they('don\'t sync cells by default', function () {
			var p = new nx.Cell({ value: 'cellar door' });
			var q = new nx.Cell({ value: 'default' });
			p['->'](q);
			q.value.should.equal('default');
		});

		they('sync cell values from source to target for one-way bindings (->>)', function () {
			var p = new nx.Cell({ value: 'cellar door' });
			var q = new nx.Cell();
			p['->>'](q);
			q.value.should.equal('cellar door');
			p = new nx.Cell();
			q = new nx.Cell({ value:'cellar door' });
			p['<<-'](q);
			p.value.should.equal('cellar door');
		});

		they('do not sync cell values from source to target for two-way bindings (<->)', function () {
			var p = new nx.Cell({ value:'cellar door' });
			var q = new nx.Cell({ value:'test' });
			p['<->'](q);
			p.value.should.equal('cellar door');
			q.value.should.not.equal('cellar door');
		});

		they('sync cell values from source to target for two-way bindings (<->>)', function () {
			var p = new nx.Cell({ value:'cellar door' });
			var q = new nx.Cell({ value:'test' });
			p['<->>'](q);
			p.value.should.equal('cellar door');
			q.value.should.equal('cellar door');
		});

		they('sync cell values from target to source for two-way bindings (<<->)', function () {
			var p = new nx.Cell({ value:'cellar door' });
			var q = new nx.Cell({ value:'test' });
			p['<<->'](q);
			p.value.should.equal('test');
			q.value.should.equal('test');
		});

		they('accept two converter functions for two-way bindings', function () {
			var seconds = new nx.Cell();
			var minutes = new nx.Cell();
			seconds['<->'](
				minutes,
				function (value) { return value / 60; },
				function (value) { return value * 60; }
			);
			minutes.value = 2;
			seconds.value.should.equal(120);
			seconds.value = 240;
			minutes.value.should.equal(4);
		});

		they('accept a data mapping for one-way bindings', function () {
			var date = new nx.Cell();
			var year = new nx.Cell();
			date['<-'](year, new nx.Mapping({ '_':'year' }));
			date.value = { year: 1985, month: 'October', day:26 };
			year.value = 2015; // also 88mph
			date.value.year.should.equal(2015);
		});

		they('invert the data mapping if only one is passed for a two-way binding', function () {
			var date = new nx.Cell();
			var year = new nx.Cell();
			date.value = {};
			date['<->'](year, new nx.Mapping({ 'year':'_' }));
			year.value = 2015; // also 88mph
			date.value.year.should.equal(2015);
			date.value = { year:1985, month:'October', day:26 };
			year.value.should.equal(1985);
		});

		they('accept an array of cells for a merging one-way binding', function () {
			var today = {
				day:   new nx.Cell({ value: 26 }),
				month: new nx.Cell({ value: 'October' }),
				year:  new nx.Cell({ value: 1985 })
			};

			var date = new nx.Cell();
			date['<<-'](
				[
					today.day,
					today.month,
					today.year
				],
				function (day, month, year) {
					return { day: day, month: month, year: year };
				}
			);

			date.value.should.deep.equal({
				day: 26,
				month: 'October',
				year: 1985
			});

			today.year.value = 2015;
			today.day.value = 27;

			date.value.should.deep.equal({
				day: 27,
				month: 'October',
				year: 2015
			});

		});
	});

	describe('onvalue', function () {
		it('is an nx.Event instance', function () {
			var p = new nx.Cell();
			p.onvalue.should.be.an.instanceof(nx.Event);
		});

		/* eslint-disable max-len */
		it('is triggered when value is set and the new value is passed to the event handlers as an argument', function () {
		/* eslint-enable */
			var p = new nx.Cell();
			var handler = sinon.spy(function (value) {
				value.should.equal('cellar door');
			});
			p.onvalue.add(handler);
			p.value = 'cellar door';
			/* eslint-disable no-unused-expressions */
			handler.should.have.been.called;
			/* eslint-enable */
		});
	});
});
