describe('Utils', function() {
	describe('interpolate_string', function() {
		it('substitutes paramaters in curly braces with the object literal\'s field values converting them to strings', function() {
			nx.Utils.interpolate_string('{a}{b}{c}', { a:1, b:2, c:3 })
				.should.equal('123');
			nx.Utils.interpolate_string('rock {amp} roll', { amp: '&' })
				.should.equal('rock & roll');
		});
	});
});
