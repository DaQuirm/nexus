describe('nx.Event', function() {

	describe('constructor', function() {
		it('creates an event instance', function() {
			var evt = new nx.Event();
			evt.should.be.an('object');
			evt.should.be.an.instanceof(nx.Event);
		});
	});

	describe('trigger', function() {
		it('fires the event calling all added handlers passing its argument to them', function() {
			var evt = new nx.Event();
			var triggerCount = 0;
			evt.add(function(value){
				value.should.equal('cellar door');
				triggerCount++;
			});
			evt.trigger('cellar door');
			triggerCount.should.equal(1);
		});
	});

	describe('add', function() {
		it('adds a handler function with an optional name parameter', function() {
			var evt = new nx.Event();
			var triggerCount = 0;
			evt.add(function(){
				triggerCount++;
			}, 'event-handler');
			evt.trigger();
			triggerCount.should.equal(1);
		});

		it('throws an error if handler\'s name is alredy in list');
	});

	describe('remove', function() {
		it('removes a handler from the event handler list by its name', function() {
			var evt = new nx.Event();
			var triggerCount = 0;
			evt.add(function(){
				triggerCount++;
			}, 'event-handler');
			evt.trigger();
			triggerCount.should.equal(1);
			evt.remove('event-handler');
			evt.trigger();
			triggerCount.should.not.equal(2);
		});
	});
});