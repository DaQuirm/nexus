var nx = {
	Cell: require('../../src/core/cell'),
	Collection: require('../../src/core/collection')
};

var nxt = {
	Command: require('../../src/nxt/command')
};

describe('nx.Collection', function () {
	'use strict';

	describe('constructor', function () {
		it('creates a collection instance', function () {
			var collection = new nx.Collection();
			collection.should.be.an('object');
			collection.should.be.an.instanceof(nx.Collection);
		});

		it('can be initialized with the `items` option', function () {
			var collection = new nx.Collection({ items: [1, 2, 3] });
			collection.items.should.deep.equal([1, 2, 3]);
		});

		it('assigns the reset command to the command cell if the `items` option is not empty', function () {
			var collection = new nx.Collection();
			collection.command.value.should.deep.equal(
				new nxt.Command('Content', 'reset', { items: [] })
			);
			collection = new nx.Collection({ items: [1, 2, 3] });
			collection.command.value.should.deep.equal(
				new nxt.Command('Content', 'reset', { items: [1, 2, 3] })
			);
		})
	});

	describe('value', function() {
		it('assigns the `reset` command to the command cell', function () {
			var collection = new nx.Collection({ items: [1, 2, 3] });
			collection.value = [4, 5];
			collection.command.value.should.deep.equal(
				new nxt.Command('Content', 'reset', { items: [4, 5] })
			);
		});
	});

	describe('items', function () {
		it('is alias to collection\'s value', function () {
			var collection = new nx.Collection();
			collection.items.should.be.an.instanceof(Array);
			collection.items.should.be.empty;
			collection.items = [4,5];
			collection.value.should.deep.equal([4,5]);
		});
	});

	describe('command', function () {
		it('is bound to collection\'s value converting commands into new values', function () {
			var collection = new nx.Collection({ items: [1, 2, 3] });
			collection.command.value = new nxt.Command('Content', 'remove', { indexes: [1] });
			collection.value.should.deep.equal([1, 3]);
		});
	});

	describe('length', function () {
		it('is an nx.Cell that stores current collection length', function () {
			var collection = new nx.Collection({ items: [1, 2] });
			collection.length.value.should.equal(2);
			collection.append(3,4);
			collection.length.value.should.equal(4);

			collection = new nx.Collection({ items: [1, 2, 3, 4, 5] });
			collection.length.value.should.equal(5);
			collection.remove(2,4);
			collection.length.value.should.equal(3);

			collection.value = [1,2];
			collection.length.value.should.equal(2);
		});
	});

	describe('append', function () {
		it('assigns the `append` command to the command cell', function () {
			var collection = new nx.Collection({ items: [1, 2] });
			collection.append(3, 4);
			collection.items.should.deep.equal([1, 2, 3, 4]);
			collection.command.value.should.deep.equal(
				new nxt.Command('Content', 'append', { items: [3, 4] })
			);
		});
	});

	describe('remove', function () {
		it('assigns the `remove` command to the command cell', function () {
			var collection = new nx.Collection({ items: [1, 2, 3, 4, 5] });
			collection.remove(2, 4);
			collection.items.should.deep.equal([1, 3, 5]);
			collection.command.value.should.deep.equal(
				new nxt.Command('Content', 'remove', { indexes: [1, 3] })
			);
		});
	});

	describe('insertBefore', function () {
		it('assigns the `insertBefore` command to the command cell', function () {
			var collection = new nx.Collection({ items: [1, 2, 4] });
			collection.insertBefore(4, 3);
			collection.items.should.deep.equal([1, 2, 3, 4]);
			collection.command.value.should.deep.equal(
				new nxt.Command('Content', 'insertBefore', { items: [3], index: 2 })
			);
		});
	});

	describe('reset', function () {
		it('assigns the `reset` command to the command cell', function () {
			var collection = new nx.Collection({ items: [1, 2, 3, 4] });
			collection.reset([5, 6]);
			collection.command.value.should.deep.equal(
				new nxt.Command('Content', 'reset', { items: [5, 6] })
			);
		});

		it('assigns an empty array `reset` command if called with no parameters', function () {
			var collection = new nx.Collection({ items: [1, 2, 3, 4, 5] });
			collection.reset();
			collection.command.value.should.deep.equal(
				new nxt.Command('Content', 'reset', { items: [] })
			);
		});
	});

	describe('swap', function () {
		it('assigns the `swap` command to the command cell', function () {
			var collection = new nx.Collection({ items: [1, 2, 3, 4, 5] });
			collection.swap(2, 4);
			collection.command.value.should.deep.equal(
				new nxt.Command('Content', 'swap', { indexes: [1, 3] })
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
					items.push(items[i - 2] + items[i - 1]);
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

		it('assignes the `reset` command to the command cell', function () {
			var cell = new nx.Cell();
			var collection = new nx.Collection();
			collection.bind(cell, '<-', fib);
			cell.value = 2;
			collection.command.value.should.deep.equal(
				new nxt.Command('Content', 'reset', { items: [1, 1] })
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
			collection.reset();
			cell.value.should.deep.equal([]);
			collection.items = ['a', 'b', 'c'];
			cell.value.should.deep.equal(['a', 'b', 'c']);
		});
	});

});
