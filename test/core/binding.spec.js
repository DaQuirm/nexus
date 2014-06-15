describe('nx.Binding', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a binding instance', function() {
			var p = new nx.Cell();
			var q = new nx.Cell();
			var binding = new nx.Binding(p, q, '->');
			binding.should.be.an('object');
			binding.should.be.an.instanceof(nx.Binding);
		});

		it('creates a binding for a source cell and a target cell using specified mode', function() {
			var source = new nx.Cell();
			var target = new nx.Cell();
			var binding = new nx.Binding(source, target, '<->');
			source.value = 'cellar door';
			target.value.should.equal('cellar door');
		});

		it('can create one way bindings from target cell to source', function() {
			var p = new nx.Cell();
			var q = new nx.Cell();
			var binding = new nx.Binding(p, q, '<-');
			q.value = 'echo';
			p.value.should.equal('echo');
			p.value = 'cellar door';
			q.value.should.not.equal('cellar door');
		});

		it('can create one way bindings from source cell to target', function() {
			var p = new nx.Cell();
			var q = new nx.Cell();
			var binding = new nx.Binding(p, q, '->');
			p.value = 'cellar door';
			q.value.should.equal('cellar door');
			q.value = 'echo';
			p.value.should.not.equal('echo');
		});

		it('accepts a converter function for one-way bindings', function() {
			var positive = new nx.Cell();
			var negative = new nx.Cell();
			var binding = new nx.Binding(positive, negative, '->', function(value) { return -value; });
			positive.value = 1;
			negative.value.should.equal(-1);
		});

		it('accepts two converter functions for two-way bindings', function() {
			var seconds = new nx.Cell();
			var minutes = new nx.Cell();
			var binding = new nx.Binding(
				seconds,
				minutes,
				'<->',
				function(value) { return value/60; },
				function(value) { return value*60; }
			);

			minutes.value = 2;
			seconds.value.should.equal(120);
			seconds.value = 240;
			minutes.value.should.equal(4);
		});

		it('accepts a data mapping for one-way bindings', function() {
			var date = new nx.Cell();
			var year = new nx.Cell();
			var binding = new nx.Binding(date, year, '<-', new nx.Mapping({ '_':'year' }));
			date.value = { year: 1985, month: 'October', day:26 };
			year.value = 2015; // also 88mph
			date.value.year.should.equal(2015);
		});

		it('inverts the data mapping if only one is passed for a two-way binding', function() {
			var date = new nx.Cell();
			var year = new nx.Cell();
			date.value = {};
			var binding = new nx.Binding(date, year, '<->', new nx.Mapping({ 'year':'_' }));
			year.value = 2015; // also 88mph
			date.value.year.should.equal(2015);
			date.value = { year: 1985, month: 'October', day:26 };
			year.value.should.equal(1985);
		});
	});
});
