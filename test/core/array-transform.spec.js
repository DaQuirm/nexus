describe('nx.ArrayTransform', function () {

	describe('append', function () {
		it('appends items to the end of an array', function() {
			var array = [1, 2];
			var result = nx.ArrayTransform.append(array, { items: [3, 4] });
			result.should.deep.equal([1, 2, 3, 4]);
		});
	});

	describe('remove', function () {
		it('removes items by their indexes from an array', function() {
			var array = [1, 2, 3, 4, 5];
			var result = nx.ArrayTransform.remove(array, { indexes: [1, 3] });
			result.should.deep.equal([1, 3, 5]);
		});
	});

	describe('insertBefore', function () {
		it('inserts items at a position in an array', function () {
			var array = [1, 2, 4];
			var result = nx.ArrayTransform.insertBefore(array, { index: 2, items: [3] });
			result.should.deep.equal([1, 2, 3, 4]);
		});
	});

	describe('reset', function () {
		it('replaces all items in an array', function() {
			var array = [1, 2, 3];
			var result = nx.ArrayTransform.reset(array, { items: [4, 5] });
			result.should.deep.equal([4, 5]);
		});
	});

	describe('swap', function () {
		it('swaps two items in an array using their indexes', function () {
			var array = [1, 2, 3, 4, 5];
			var result = nx.ArrayTransform.swap(array, { indexes: [1, 3] });
			result.should.deep.equal([1, 4, 3, 2, 5]);
		});
	});

	it('processes collection-generated commands and calls appropriate methods', function () {
		var result;
		result = nx.ArrayTransform([1, 2], new nxt.Command('*', 'append', { items: [3, 4] }));
		result.should.deep.equal([1, 2, 3, 4]);
		result = nx.ArrayTransform([1, 2], new nxt.Command('*', 'reset', { items: [3, 4] }));
		result.should.deep.equal([3, 4]);
	});

});
