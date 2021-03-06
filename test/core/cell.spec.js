var nx = {
	Binding: require('../../src/core/binding'),
	Cell: require('../../src/core/cell'),
	Collection: require('../../src/core/collection'),
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

		it('passes the old value to action as the second argument', function () {
			var spy = sinon.spy();
			var cell = new nx.Cell({ action: spy, value: 'old' });
			cell.value = 'new';
			spy.should.have.been.calledWith('new', 'old');
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
	});

	it('accepts a compare function for comparing values');

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

		they('accept a converting function of new and old values', function () {
			var p = new nx.Cell();
			var q = new nx.Cell();
			var spy = sinon.spy(function (number, oldNumber) {
				return [number, oldNumber];
			});
			p['->'](q, spy);
			p.value = 0;
			spy.should.have.been.calledWith(p.value, undefined);
			p.value = 1;
			spy.should.have.been.calledWith(1, 0);
			p.value = 2;
			p.value = 3;
			spy.should.have.been.calledWith(3, 2);
			q.value.should.deep.equal([3, 2]);
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

		they('accept a function for one-to-many demux source-target binding', function () {
			var students = new nx.Collection();
			var gryffindor = new nx.Collection();
			var slytherin = new nx.Collection();
			var sortingHat = function (command) {
				var student = command.data.items[0];
				if (student.brave) {
					return gryffindor.command;
				} else if (student.cunning) {
					return slytherin.command;
				}
			};
			students.command['->'](sortingHat);
			var potter = { brave: true };
			var malfoy = { cunning: true };
			var longbottom = { brave: true };
			students.append(malfoy);
			students.append(potter);
			students.append(longbottom);
			gryffindor.items.should.deep.equal([potter, longbottom]);
			slytherin.items.should.deep.equal([malfoy]);
		});

		they('bind cells dynamically to cells derived from cell\'s value: one-way', function () {
			var reader = new nx.Cell();
			var writer = new nx.Cell();
			var string = new nx.Cell();

			reader['<-*'](string, 'string');
			writer['->*'](string, 'string');
			var first = new nx.Cell();
			var second = new nx.Cell();
			string.value = { string: first };
			first.value = 'cellar';
			reader.value.should.equal(first.value);

			string.value = { string: second };
			writer.value = 'door';
			second.value.should.equal(writer.value);
			first.value.should.not.equal(writer.value);

			first.value = '*';
			reader.value.should.equal(second.value);

			second.value = '**';
			reader.value.should.equal('**');
		});

		they('bind cells dynamically to cells derived from cell\'s value: one-way, forced', function () {
			var reader = new nx.Cell();
			var writer = new nx.Cell({ value: 'door' });
			var string = new nx.Cell({ string: new nx.Cell({ value: 'cellar' }) });

			reader['<<-*'](string, 'string');
			var first = new nx.Cell({ value: '*' });
			var second = new nx.Cell();
			string.value = { string: first };
			reader.value.should.equal(first.value);

			string.value = { string: second };
			writer['->>*'](string, 'string');
			second.value.should.equal(writer.value);
			first.value.should.not.equal(writer.value);
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
