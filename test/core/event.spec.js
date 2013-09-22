describe('nx.Event', function() {
	'use strict';

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
			var handler = sinon.spy();
			var anotherHandler = sinon.spy();
			evt.add(handler);
			evt.add(anotherHandler);
			evt.trigger('cellar door');
			handler.should.have.been.called;
			anotherHandler.should.have.been.called;
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

		it('returns handler name', function () {
			var evt = new nx.Event();
			var triggerCount = 0;
			var name = evt.add(function(){
				triggerCount++;
			}, 'event-handler');
			name.should.equal('event-handler');
			name = evt.add(function(){ triggerCount++; });
			should.exist(name);
		});

		it('throws an error if handler\'s name is alredy in list');
	});

	describe('remove', function() {
		it('removes a handler from the event handler list by its name', function() {
			var evt = new nx.Event();
			var handler = sinon.spy();
			evt.add(handler, 'event-handler');
			evt.trigger();
			evt.remove('event-handler');
			evt.trigger();
			handler.should.have.been.calledOnce;
		});
	});
});
