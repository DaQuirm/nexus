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

		it('triggers all registered handlers', function() {
			var evt = new nx.Event();
			var handler = function(value) { return value; };
			var anotherHandler = function(value) { return value; };
			var handlerSpy = chai.spy(handler);
			var anotherHandlerSpy = chai.spy(anotherHandler);
			evt.trigger('cellar door');
			handlerSpy.should.have.been.called;
			anotherHandlerSpy.should.have.been.called;
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
			var handler = function(){
				triggerCount++;
			};
			var handlerSpy = chai.spy(handler);
			evt.add(handler, 'event-handler');
			evt.trigger();
			evt.remove('event-handler');
			evt.trigger();
			handlerSpy.should.have.been.called.once;
		});
	});
});