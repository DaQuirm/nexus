describe('nx.Binding', function() {

	describe('constructor', function() {
		it('creates a binding instance', function() {
			var binding = new nx.Binding();
			binding.should.be.an('object');
			binding.should.be.an.instanceof(nx.Binding);
		});

		it('creates a binding for a source property and a target property using specified mode', function() {
			var source = new nx.Property();
			source.value = 'cellar door';
			var target = new nx.Property();
			var binding = new nx.Binding(source, target, '<->');
			binding.sync();
			target.value.should.equal('cellar door');
		});

		it('can create one way bindings from target property to source', function(){
			var p = new nx.Property();
			var q = new nx.Property();
			var binding = new nx.Binding(p, q, '<-');
			p.value = 'cellar door';
			binding.sync();
			q.value.should.not.equal('cellar door');
			q.value = 'echo';
			p.value.should.equal('echo');
		});

		it('can create one way bindings from source property to target', function(){
			var p = new nx.Property();
			var q = new nx.Property();
			var binding = new nx.Binding(p, q, '->');
			p.value = 'cellar door';
			binding.sync();
			q.value.should.equal('cellar door');
			q.value = 'echo';
			p.value.should.not.equal('echo');
		});

		it('accepts a converter function for one-way bindings', function() {
			var positive = new nx.Property();
			var negative = new nx.Property();
			var binding = new nx.Binding(positive, negative, '->', function(value) { return -value; });
			positive.value = 1;
			binding.sync();
			negative.value.should.equal(-1);
		});

		it('accepts two converter functions for two-way bindings', function() {
			var seconds = new nx.Property();
			var minutes = new nx.Property();
			var binding = new nx.Binding(
				seconds,
				minutes,
				'<->',
				function(value) {return value/60;},
				function(value) {return value*60;}
			);

			minutes.value = 2;
			binding.sync();
			seconds.value.should.equal(120);
			seconds.value = 240;
			binding.sync();
			minutes.value.should.equal(4);
		});

		it('accepts a data mapping for one-way bindings', function() {
			var date = new nx.Property();
			var year = new nx.Property();
			var binding = new nx.Binding(date, year, '<-', new nx.Mapping({ '@':'year' }));
			date.value = { year: 1985, month: 'October', day:26 };
			binding.sync();
			year.value = 2015 // also 88mph
			binding.sync();
			date.value.year.should.equal(2015);
		});

		it('inverts the data mapping if only one is passed for a two-way binding', function() {
			var date = new nx.Property();
			var year = new nx.Property();
			var binding = new nx.Binding(date, year, '<->', new nx.Mapping({ '@':'year' }));
			year.value = 2015 // also 88mph
			binding.sync();
			date.value.year.should.equal(2015);
			date.value = { year: 1985, month: 'October', day:26 };
			binding.sync();
			year.value.should.equal(1985);
		});

	});

	describe('sync', function() {
		it('updates bound property values from source to target', function() {
			var p = new nx.Property();
			var q = new nx.Property();
			p.value = 'cellar door';
			var binding = p.bind(q, '->');
			binding.sync();
			q.value.should.equal('cellar door');
		});
	});
});