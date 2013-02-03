describe('nx.Binding', function() {

	describe('constructor', function() {
		it('creates a binding instance', function() {
			var binding = new nx.Binding();
			binding.should.be.an('object');
			binding.should.be.an.instanceof(nx.Binding);
		});
	});

	describe('sync', function() {
		it('updates bound property values', function() {
			var p = new nx.Property();
			var q = new nx.Property();
			p.value = 'cellar door';
			var binding = p.bind(q, '->');
			binding.sync();
			q.value.should.equal('cellar door');
		});
	});
});