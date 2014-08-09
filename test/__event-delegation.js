describe('', function() {
	it('attaches delegated event handlers if there are any', function(done) {
		document.body.appendChild(container);
		var collection = new nx.Collection({ items: ['a','b','c'] });
		var renderer = new nxt.CollectionRenderer(container);
		renderer.render(
			nxt.Collection(collection, function(item) {
					return nxt.Element('li',
						nxt.Element('span',
							nxt.Text(item)
						)
					)
				},
				nxt.DelegatedEvent('click', {
					'span': function(evt, item) {
						item.should.equal('c');
						document.body.removeChild(container);
						done();
					}
				})
			)
		);
		container.childNodes[2].childNodes[0].click();
	});

	it('allows an arbitrary number of delegate event handlers to be passed', function() {
		var collection = new nx.Collection();
		var converter = function(item) { return nxt.Element('li', nxt.Element('a', nxt.Text(item))); };
		var linkEvent = nxt.DelegatedEvent('mouseover', { 'a': function(evt, item) {} });
		var command = new nxt.Collection(
			collection,
			converter,
			nxt.DelegatedEvent('click', { 'li': function(evt, item) {} }),
			linkEvent
		);
		command.collection.should.equal(collection);
		command.conversion.should.equal(converter);
		command.type.should.equal('Collection');
		command.events.length.should.equal(2);
		command.events[1].should.deep.equal(linkEvent);
		command.dynamic.should.equal(true);
	});

});

