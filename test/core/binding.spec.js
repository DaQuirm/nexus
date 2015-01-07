describe('nx.Binding', function () {
	'use strict';

	describe('constructor', function () {
		it('creates a binding instance', function () {
			var p = new nx.Cell();
			var q = new nx.Cell();
			var binding = new nx.Binding(p, q);
			binding.should.be.an('object');
		});

		it('creates a binding for a source cell and a target cell', function() {
			var source = new nx.Cell();
			var target = new nx.Cell();
			var binding = new nx.Binding(source, target);
			source.value = 'cellar door';
			binding.sync();
			target.value.should.equal('cellar door');
		});

		it('accepts a converter function for one-way bindings', function() {
			var positive = new nx.Cell();
			var negative = new nx.Cell();
			var binding = new nx.Binding(positive, negative, function(value) { return -value; });
			positive.value = 1;
			binding.sync();
			negative.value.should.equal(-1);
		});
	});

	describe('pair', function () {
		it('creates a shared lock object for two bindings', function () {
			var p = new nx.Cell();
			var q = new nx.Cell();
			var firstBinding = new nx.Binding(p, q);
			var secondBinding = new nx.Binding(q, p);
			var lock = firstBinding.pair(secondBinding);
			lock.should.be.an('object');
			lock.locked.should.equal(false);
		});
	});

	describe('unbind', function () {
		it('removes a binding', function () {
			var p = new nx.Cell();
			var q = new nx.Cell();
			var binding = p['->'](q);
			p.value = 'cellar door';
			binding.unbind();
			p.value = null;
			q.value.should.equal('cellar door');
		});
	});
});
