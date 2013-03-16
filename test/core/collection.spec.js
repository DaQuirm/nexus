describe('nx.Collection', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a collection instance', function() {
			var collection = new nx.Collection();
			collection.should.be.an('object');
			collection.should.be.an.instanceof(nx.Collection);
		});

		it('can be initialized with the `items` option', function () {
			var collection = new nx.Collection({items});
		});
	});

	describe('items', function() {
		it('is an array representing collection\'s items', function() {
			var collection = new nx.Collection();
			collection.items.should.be.an.instanceof(Array);
			collection.items.should.be.empty();
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
			var handler = chai.spy(function(event){
				event.items.should.deep.equal([3,4]);
			});
			collection.onappend.add(handler);
			collection.append(3,4);
			collection.items.should.deep.equal([1,2,3,4]);
			handler.should.have.been.called();
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
			var handler = chai.spy(function(event){
				event.items.should.deep.equal([2,4]);
				event.indexes.should.deep.equal([1,3]);
			});
			collection.onremove.add(handler);
			collection.remove(2,4);
			collection.items.should.deep.equal([1,3,5]);
			handler.should.have.been.called();
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
			var handler = chai.spy(function(event) {
				event.items.should.deep.equal([3]);
				event.index.should.equal(2);
			});
			collection.oninsertbefore.add(handler);
			collection.insertBefore(4,3);
			collection.items.should.deep.equal([1,2,3,4]);
			handler.should.have.been.called();
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
			var handler = chai.spy(function(event){
				event.items.should.deep.equal([]);
			});
			collection.onreset.add(handler);
			collection.removeAll();
			collection.items.should.deep.equal([]);
			handler.should.have.been.called();
		});
	});

});
