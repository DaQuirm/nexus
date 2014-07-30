describe('nx.Collection', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a collection instance', function() {
			var collection = new nx.Collection();
			collection.should.be.an('object');
			collection.should.be.an.instanceof(nx.Collection);
		});

		it('can be initialized with the `items` option', function () {
			var collection = new nx.Collection({ items: [1,2,3] });
			collection.items.should.deep.equal([1,2,3]);
		});

		it('assigns the append command to the event cell if the `items` option is not empty', function () {
			var collection = new nx.Collection();
			collection.event.value.should.deep.equal(
				new nxt.Command('Collection', 'reset', { items: [] })
			);
			collection = new nx.Collection({ items: [1,2,3] });
			collection.event.value.should.deep.equal(
				new nxt.Command('Collection', 'reset', { items: [1,2,3] })
			);
		})
	});

	describe('items', function() {
		it('is an array representing collection\'s items', function() {
			var collection = new nx.Collection();
			collection.items.should.be.an.instanceof(Array);
			collection.items.should.be.empty;
		});
	});

	describe('append', function() {
		it('appends items to the end', function() {
			var collection = new nx.Collection({ items: [1,2] });
			collection.append(3,4);
			collection.items.should.deep.equal([1,2,3,4]);
		});

		it('assigns the `append` command to the event cell', function() {
			var collection = new nx.Collection({ items: [1,2] });
			collection.append(3,4);
			collection.items.should.deep.equal([1,2,3,4]);
			collection.event.value.should.deep.equal(
				new nxt.Command('Collection', 'append', { items: [3,4] })
			);
		});
	});

	describe('remove', function() {
		it('removes items by reference', function() {
			var collection = new nx.Collection({ items: [1,2,3,4,5] });
			collection.remove(2,4);
			collection.items.should.deep.equal([1,3,5]);
		});

		it('assigns the `remove` command to the event cell', function() {
			var collection = new nx.Collection({ items: [1,2,3,4,5] });
			collection.remove(2,4);
			collection.items.should.deep.equal([1,3,5]);
			collection.event.value.should.deep.equal(
				new nxt.Command('Collection', 'remove', { items: [2,4], indexes: [1,3] })
			);
		});
	});

	describe('insertBefore', function() {
		it('inserts item(s) before an item in collection', function () {
			var collection = new nx.Collection({ items: [1,2,4] });
			collection.insertBefore(4,3);
			collection.items.should.deep.equal([1,2,3,4]);
		});

		it('assigns the `insertbefore` command to the event cell', function() {
			var collection = new nx.Collection({ items: [1,2,4] });
			collection.insertBefore(4,3);
			collection.items.should.deep.equal([1,2,3,4]);
			collection.event.value.should.deep.equal(
				new nxt.Command('Collection', 'insertbefore', { items: [3], index: 2 })
			);
		});
	});

	describe('removeAll', function () {
		it('removes all items in the collection', function() {
			var collection = new nx.Collection({ items: [1,2,3,4,5] });
			collection.remove(2,4);
			collection.items.should.deep.equal([1,3,5]);
		});

		it('assigns the `reset` command to the event cell', function() {
			var collection = new nx.Collection({ items: [1,2,3,4] });
			collection.removeAll();
			collection.items.should.deep.equal([]);
			collection.event.value.should.deep.equal(
				new nxt.Command('Collection', 'reset', { items: [] })
			);
		});
	});

	describe('set', function () {
		it('populates the collection from an array discarding all existing items', function() {
			var collection = new nx.Collection({ items: [1,2,3] });
			collection.set([4,5]);
			collection.items.should.deep.equal([4,5]);
		});

		it('assigns the `reset` command to the event cell', function() {
			var collection = new nx.Collection({ items: [1,2,3] });
			collection.set([4,5]);
			collection.items.should.deep.equal([4,5]);
			collection.event.value.should.deep.equal(
				new nxt.Command('Collection', 'reset', { items: [4,5] })
			);
		});
	});

	// additional tests for the inherited bind method
	describe('bind', function() {
		var fib = function(value) {
			var items = [];
			for (var i = 0; i < value; i ++) {
				if (i < 2) {
					items.push(1);
				} else {
					items.push(items[i-2] + items[i-1]);
				}
			}
			return items;
		};

		it('binds a cell with an nx.Collection instance by generating collection items based on cell value', function () {
			var cell = new nx.Cell();
			var collection = new nx.Collection();
			collection.bind(cell, '<-', fib);
			cell.value = 9;
			collection.items.should.deep.equal([1, 1, 2, 3, 5, 8, 13, 21, 34]);
		});

		it('assignes the `reset` command to the event cell', function () {
			var cell = new nx.Cell();
			var collection = new nx.Collection();
			collection.bind(cell, '<-', fib);
			cell.value = 2;
			collection.event.value.should.deep.equal(
				new nxt.Command('Collection', 'reset', { items: [1, 1] })
			);
		});

		it('binds a cell and a collection with a two-way binding', function () {
			var cell = new nx.Cell();
			var collection = new nx.Collection();
			collection.bind(cell, '<->');
			cell.value = ['a', 'b', 'c'];
			collection.items.should.deep.equal(['a', 'b', 'c']);
			collection.append('d');
			cell.value.should.deep.equal(['a', 'b', 'c', 'd']);
			collection.remove('a', 'c');
			cell.value.should.deep.equal(['b', 'd']);
			collection.insertBefore('b', 'e');
			cell.value.should.deep.equal(['e', 'b', 'd']);
			collection.removeAll();
			cell.value.should.deep.equal([]);
			collection.set(['a', 'b', 'c']);
			cell.value.should.deep.equal(['a', 'b', 'c']);
		});
	});

});
