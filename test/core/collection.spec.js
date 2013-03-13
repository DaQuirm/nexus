describe('nx.Collection', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a collection instance', function() {
			var collection = new nx.Collection();
			collection.should.be.an('object');
			collection.should.be.an.instanceof(nx.Collection);
		});
	});

	describe('append');
	describe('remove');
	describe('insertBefore');
	describe('clear');
	describe('each');
	describe('toArray');

});
