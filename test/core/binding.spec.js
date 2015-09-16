var nx = {
	Binding: require('../../src/core/binding'),
	Cell: require('../../src/core/cell')
};

describe('nx.Binding', function () {
	'use strict';

	describe('constructor', function () {
		it('creates a binding instance', function () {
			var p = new nx.Cell();
			var q = new nx.Cell();
			var binding = new nx.Binding(p, q);
			binding.should.be.an('object');
		});

		it('creates a binding for a source cell and a target cell', function () {
			var source = new nx.Cell();
			var target = new nx.Cell();
			var binding = new nx.Binding(source, target);
			source.value = 'cellar door';
			binding.sync();
			target.value.should.equal('cellar door');
		});

		it('sets `locked` to false', function () {
			var p = new nx.Cell();
			var q = new nx.Cell();
			var binding = new nx.Binding(p, q);
			binding.locked.should.equal(false);
		});

		it('accepts a converter function for one-way bindings', function () {
			var positive = new nx.Cell();
			var negative = new nx.Cell();
			var binding = new nx.Binding(positive, negative, function (value) { return -value; });
			positive.value = 1;
			binding.sync();
			negative.value.should.equal(-1);
		});
	});

	describe('pair', function () {
		it('adds mutual references to two bindings', function () {
			var p = new nx.Cell();
			var q = new nx.Cell();
			var firstBinding = new nx.Binding(p, q);
			var secondBinding = new nx.Binding(q, p);
			firstBinding.pair(secondBinding);
			firstBinding.twin.should.equal(secondBinding);
			secondBinding.twin.should.equal(firstBinding);
		});
	});

	describe('lock/unlock', function () {
		var they = it;
		they('activate or deactivate binding\'s syncing', function () {
			var p = new nx.Cell({ value: '?' });
			var q = new nx.Cell({ value: '!' });
			var binding = new nx.Binding(p, q);
			binding.lock();
			binding.sync();
			q.value.should.equal('!').and.should.not.equal(p.value);
			binding.unlock();
			binding.sync();
			q.value.should.equal(p.value);
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
