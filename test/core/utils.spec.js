var nx = {
	Utils: require('../../src/core/utils')
};

describe('Utils', function() {

	describe('interpolateString', function() {
		it('substitutes paramaters in curly braces with the object literal\'s field values converting them to strings', function() {
			nx.Utils.interpolateString('{a}{b}{c}', { a:1, b:2, c:3 })
				.should.equal('123');
			nx.Utils.interpolateString('rock {amp} roll', { amp: '&' })
				.should.equal('rock & roll');
		});

		it('doesn\'t fail when the string contains no curly-braced placeholders', function() {
			var string = 'cellar door';
			nx.Utils.interpolateString(string, { a:1, b:2, c:3 })
				.should.equal(string);
		})
	});

	describe('mixin', function () {
		it('copies all own properties from one object to another, including defined ones', function () {
			var source = {
				cellar: 'door'
			};
			Object.defineProperty(source, 'proxy', {
				enumerable: true,
				get: function () {
					return this._value;
				},
				set: function (value) {
					this._value = value * 2;
				}
			});
			var target = {};
			nx.Utils.mixin(target, source);
			target.cellar.should.equal('door');
			target.proxy = 2;
			target.proxy.should.equal(4);
		});
	});
});
