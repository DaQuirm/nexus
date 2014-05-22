describe('nx.Collection', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a collection instance', function() {
			var collection = new nx.Collection();
			collection.should.be.an('object');
			collection.should.be.an.instanceof(nx.Collection);
		});

		it('can be initialized with the `items` option', function () {
			var collection = new nx.Collection({items: [1,2,3]});
			collection.items.should.deep.equal([1,2,3]);
		});
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
			var collection = new nx.Collection({items: [1,2]});
			collection.append(3,4);
			collection.items.should.deep.equal([1,2,3,4]);
		});

		it('fires the `onappend` event', function() {
			var collection = new nx.Collection({items: [1,2]});
			var handler = sinon.spy(function(event){
				event.items.should.deep.equal([3,4]);
			});
			collection.onappend.add(handler);
			collection.append(3,4);
			collection.items.should.deep.equal([1,2,3,4]);
			handler.should.have.been.called;
		});
	});

	describe('remove', function() {
		it('removes items by reference', function() {
			var collection = new nx.Collection({items: [1,2,3,4,5]});
			collection.remove(2,4);
			collection.items.should.deep.equal([1,3,5]);
		});

		it('fires the `onremove` event', function() {
			var collection = new nx.Collection({items: [1,2,3,4,5]});
			var handler = sinon.spy(function(event){
				event.items.should.deep.equal([2,4]);
				event.indexes.should.deep.equal([1,3]);
			});
			collection.onremove.add(handler);
			collection.remove(2,4);
			collection.items.should.deep.equal([1,3,5]);
			handler.should.have.been.called;
		});
	});

	describe('insertBefore', function() {
		it('inserts an item before an item in collection', function () {
			var collection = new nx.Collection({items: [1,2,4]});
			collection.insertBefore(4,3);
			collection.items.should.deep.equal([1,2,3,4]);
		});

		it('fires the `oninsertbefore` event', function() {
			var collection = new nx.Collection({items: [1,2,4]});
			var handler = sinon.spy(function(event) {
				event.item.should.deep.equal(3);
				event.index.should.equal(2);
			});
			collection.oninsertbefore.add(handler);
			collection.insertBefore(4,3);
			collection.items.should.deep.equal([1,2,3,4]);
			handler.should.have.been.called;
		});
	});

	describe('removeAll', function () {
		it('removes all items in the collection', function() {
			var collection = new nx.Collection({items: [1,2,3,4,5]});
			collection.remove(2,4);
			collection.items.should.deep.equal([1,3,5]);
		});

		it('fires the `onreset` event', function() {
			var collection = new nx.Collection({items: [1,2,3,4]});
			var handler = sinon.spy();
			collection.onreset.add(handler);
			collection.removeAll();
			collection.items.should.deep.equal([]);
			handler.should.have.been.calledWith({items:[]});
		});
	});

	describe('set', function () {
		it('populates the collection from an array discarding all existing items', function() {
			var collection = new nx.Collection({items: [1,2,3]});
			collection.set([4,5]);
			collection.items.should.deep.equal([4,5]);
		});

		it('fires the `onreset` event', function() {
			var collection = new nx.Collection({items: [1,2,3]});
			var handler = sinon.spy();
			collection.onreset.add(handler);
			collection.set([4,5]);
			collection.items.should.deep.equal([4,5]);
			handler.should.have.been.calledWith({items:[4,5]});
		});
	});

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

		it('binds a property with an nx.Collection instance by generating collection items based on property value', function () {
			var p = new nx.Property();
			var collection = new nx.Collection();
			collection.bind(p, fib);
			p.value = 9;
			collection.items.should.deep.equal([1, 1, 2, 3, 5, 8, 13, 21, 34]);
		});

		it('triggers collection reset event', function () {
			var p = new nx.Property();
			var collection = new nx.Collection();
			collection.bind(p, fib);
			var trigger_spy = sinon.spy(collection.onreset, 'trigger');
			p.value = 2;
			trigger_spy.should.have.been.calledWith({ items: [1, 1] });
		});
	});

});
