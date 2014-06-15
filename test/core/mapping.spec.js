describe('nx.Mapping', function() {
	'use strict';

	describe('constructor', function() {
		it('creates a mapping', function() {
			var mapping = new nx.Mapping();
			mapping.should.be.an.instanceof(nx.Mapping);
		});
	});

	describe('map', function() {
		it('is an identity function when mapping was created without parameters', function() {
			var identity = new nx.Mapping();
			identity.map({ value: 'cellar door'}).should.deep.equal({ value: 'cellar door'});
		});

		it('maps an object literal to its field', function() {
			var mapping = new nx.Mapping({'price':'_'});
			var price = 0;
			var book = { title:'The Last Hero', price:24.73 };
			price = mapping.map(book);
			price.should.equal(24.73);
		});

		it('returns mapping result', function() {
			var mapping = new nx.Mapping({'price':'_'});
			var book = { title:'The Last Hero', price:24.73 };
			var price = mapping.map(book);
			price.should.equal(24.73);
		});

		it('maps a value to a field in an object literal and merges it with the second argument', function() {
			var mapping = new nx.Mapping({'_':'price'});
			var price = 24.73;
			var book = { title:'The Last Hero' };
			mapping.map(price, book);
			book.price.should.equal(24.73);
		});

		it('maps multiple fields to other fields in an object literal', function () {
			var symmetryMapping = new nx.Mapping({'x':'y', 'y':'x'});
			var point1 = { x: 10, y: 5 };
			var point2 = {};
			symmetryMapping.map(point1, point2);
			point2.x.should.equal(5);
			point2.y.should.equal(10);
		});

		it('ignores getting and setting undefined objects\' fields', function() {
			var obj = undefined;
			var mapping = new nx.Mapping({ 'code': '_' });
			(function(){ mapping.map(obj); }).should.not.throw(TypeError);
			should.not.exist(mapping.map(obj));
			mapping = new nx.Mapping({ '_':'code' });
			(function(){ mapping.map(obj, 1337); }).should.not.throw(TypeError);
		})
	});

	describe('inverse', function() {
		it('is a factory method that creates a mirror mapping', function() {
			var mapping = new nx.Mapping({'_':'price'});
			var inverse = mapping.inverse();
			inverse.should.be.an.instanceof(nx.Mapping);
			var book = { title:'The Last Hero', price:24.73 };
			var price = inverse.map(book);
			price.should.equal(24.73);
		});
	});
});
