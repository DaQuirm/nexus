describe('nx.Property', function() {

	describe('constructor', function() {
		it('creates a property instance', function() {
			var property = new nx.Property();
			property.should.be.an('object');
			property.should.be.an.instanceof(nx.Property);
		});

		it('accepts a property setter for side effects', function() {
			var counter = 0;
			var property = new nx.Property({
				set: function(value) {
					counter++;
				}
			});

			property.value = "cellar door";
			counter.should.equal(1);
		});

		it('accepts a compare function for comparing values');
	});

	describe('value',function() {
		it('creates an interface for the property value', function() {
			var property = new nx.Property();
			property.value = 'cellar door';
			property.value.should.equal('cellar door');
			var val = property.value;
			val.should.equal('cellar door');
		});
	});

	describe('bind', function() {
		it('connects a property to another property and keeps their value synchronized', function() {
			var p = new nx.Property();
			var q = new nx.Property();
			p.bind(q, '<->');
			p.value = 'cellar door';
			q.value.should.equal('cellar door');
			q.value = 'echo';
			p.value.should.equal('echo');
		});

		it('returns an nx.Binding instance', function() {
			var p = new nx.Property();
			var q = new nx.Property();
			var binding = p.bind(q, '->');
			binding.should.be.an.instanceof(nx.Binding);
		});

		it('accepts an nx.Binding instance as the second argument', function() {
			var date = new nx.Property();
			var year = new nx.Property();
			var yearBinding = new nx.Binding(date, year, '<->', new nx.Mapping({ '@':'year' }));
			date.bind(year, yearBinding);
			year.value = 2015 // also 88mph
			date.value.year.should.equal(2015);
			date.value = { year: 1985, month: 'October', day:26 };
			year.value.should.equal(1985);
		});
	});

	describe('unbind', function() {
		it('removes specified binding', function() {
			var p = new nx.Property();
			var q = new nx.Property();
			p.value = 'echo'
			var binding = p.bind(q, '<->');
			p.unbind(q);
			q.value = 'cellar door';
			p.value.should.not.equal('cellar door');
		});
	});
});