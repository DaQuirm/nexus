var _ = require('lodash');

var nx = {
	Cell: require('../../src/core/cell'),
	Collection: require('../../src/core/collection'),
	Command: require('../../src/core/command')
};

var renderers = require('../../src/nxt/renderers');

var nxt = _.assign(
	{
		Command: require('../../src/nxt/command'),
		ContentRenderer: renderers('ContentRenderer')
	},
	require('../../src/nxt/helpers')
);

describe('nxt helpers', function () {
	'use strict';

	describe('nxt.Attr', function () {
		it('creates an attribute name-value command', function () {
			var command = nxt.Attr('class', 'button-big-red');
			command.type.should.equal('Attr');
			command.method.should.equal('render');
			command.data.should.deep.equal({ name: 'class', value: 'button-big-red' });
		});

		it('creates an attribute collection command', function () {
			var command = nxt.Attr({
				'class': 'button-big-red',
				'data-label': 'Hit me!'
			});
			command.type.should.equal('Attr');
			command.method.should.equal('render');
			command.data.items.should.deep.equal({
				'class': 'button-big-red',
				'data-label': 'Hit me!'
			});
		});

		it('sets attribute value to an empty string by default', function () {
			var command = nxt.Attr('selected');
			command.data.should.deep.equal({ name: 'selected', value: '' });
		});
	});

	describe('nxt.Class', function () {
		it('creates a class-toggling command based on class name', function () {
			var command = nxt.Class('cellar-door');
			command.type.should.equal('Class');
			command.method.should.equal('render');
			command.data.should.deep.equal({ name: 'cellar-door' });
		});
	});

	describe('nxt.Text', function () {
		it('creates a text command containing a text node', function () {
			var command = nxt.Text('cellar door');
			command.type.should.equal('Node');
			command.method.should.equal('render');
			command.data.text.should.equal('cellar door');
			command.data.node.nodeType.should.equal(Node.TEXT_NODE);
			command.data.node.nodeValue.should.equal('cellar door');
		});

		it('returns undefined if text value is undefined', function () {
			var result = nxt.Text();
			should.not.exist(result);
			var command = nxt.Text('');
			command.type.should.equal('Node');
			command.method.should.equal('render');
			command.data.text.should.equal('');
			command.data.node.nodeType.should.equal(Node.TEXT_NODE);
			command.data.node.nodeValue.should.equal('');
		});
	});

	describe('nxt.Event', function () {
		it('creates an event command', function () {
			var handler = function (event) {
				event.preventDefault();
			};
			var command = nxt.Event('mouseover', handler);
			command.type.should.equal('Event');
			command.method.should.equal('add');
			command.data.name.should.equal('mouseover');
		});

		it('links an event to a cell using specified handler-conversion of the original event', function () {
			var cell = new nx.Cell();

			var command = nxt.Element('div',
				nxt.Event('click', cell, function (event) {
					event.type.should.equal('click');
					return 'cellar door';
				})
			);
			command.data.node.click();
			cell.value.should.equal('cellar door');
		});

		it('links an event to a cell using without conversion', function () {
			var cell = new nx.Cell();

			var command = nxt.Element('div',
				nxt.Event('click', cell)
			);
			command.data.node.click();
			cell.value.type.should.equal('click');
		});
	});

	describe('nxt.Element', function () {
		it('creates an element command', function () {
			var command = nxt.Element('div');
			command.type.should.equal('Node');
			command.method.should.equal('render');
			command.data.node.nodeType.should.equal(Node.ELEMENT_NODE);
			command.data.node.nodeName.toLowerCase().should.equal('div');
		});

		it('renders inner content', function () {
			var command = nxt.Element('div',
				nxt.Attr('class', 'button-big-blue'),
				nxt.Text('Click Me!')
			);
			command.data.node.childNodes.length.should.equal(1);
			command.data.node.childNodes[0].nodeType.should.equal(Node.TEXT_NODE);
			command.data.node.childNodes[0].nodeValue.should.equal('Click Me!');
			command.data.node.attributes.length.should.equal(1);
			command.data.node.getAttribute('class').should.equal('button-big-blue');
		});

		it('accepts both single content items and item arrays', function () {
			var command = nxt.Element('div',
				nxt.Attr('class', 'button-big-blue'),
				nxt.Text('ce'),
				[
					nxt.Text('ll'),
					nxt.Text('ar'),
					nxt.Text(' '),
					nxt.Text('do')
				],
				nxt.Text('or')
			);
			command.data.node.childNodes.length.should.equal(6);
			command.data.node.textContent.should.equal('cellar door');
		});
	});

	describe('nxt.Binding', function () {
		it('creates a binding command cell', function () {
			var cell = new nx.Cell();
			var converter = function (value) { return nxt.Text(value); };
			var commandCell = nxt.Binding(cell, converter);
			cell.value = 'cellar door';
			commandCell.value.type.should.equal('Node');
			commandCell.value.method.should.equal('render');
			commandCell.value.data.text.should.equal('cellar door');
			commandCell.value.data.node.nodeType.should.equal(Node.TEXT_NODE);
			commandCell.value.data.node.nodeValue.should.equal('cellar door');
		});

		it.skip('creates a bi-directionally bound command cell when two converters are passed', function () {
			var cell = new nx.Cell({ value: '' });
			var commandCell = nxt.Binding(
				cell,
				function (value) {
					return value.toUpperCase();
				},
				function (value) {
					return value.toLowerCase();
				}
			);
			cell.value = 'cellar door';
			commandCell.value.should.equal('CELLAR DOOR');
			commandCell.value = 'SNASA';
			cell.value.should.equal('snasa');
		});
	});

	describe('nxt.ItemEvent', function () {
		it('creates a delegated event object', function () {
			var handlerMap = {
				'li': function () {},
				'a': function () {}
			};
			var command = nxt.ItemEvent('click', handlerMap);
			command.handlers.should.deep.equal(handlerMap);
			command.name.should.equal('click');
		});
	});

	describe('nxt.Collection', function () {
		it('creates a collection command cell', function () {
			var collection = new nx.Collection();
			var converter = function (item) { return nxt.Text(item); };
			var commandCell = new nxt.Collection(collection, converter);
			collection.append('cellar door');
			commandCell.value.type.should.equal('Content');
			var textCommand = commandCell.value.data.items[0];
			textCommand.type.should.equal('Node');
			textCommand.method.should.equal('render');
			textCommand.data.text.should.equal('cellar door');
			textCommand.data.node.nodeType.should.equal(Node.TEXT_NODE);
			textCommand.data.node.nodeValue.should.equal('cellar door');
		});

		it('transforms regular commands into nxt commands', function () {
			var collection = new nx.Collection();
			var converter = function (item) { return nxt.Text(item); };
			var commandCell = new nxt.Collection(collection, converter);
			collection.append('1');
			var command = collection.command.value;
			commandCell.value.should.deep.equal(
				new nxt.Command('Content', command.method, { items: command.data.items.map(converter) })
			);
		});

		it('doesn\'t modify original command data', function () {
			var collection = new nx.Collection();
			var converter = function (item) { return nxt.Text(item); };
			var commandCell = new nxt.Collection(collection, converter);
			collection.append('1');
			var command = collection.command.value;
			commandCell.value.should.deep.equal(
				new nxt.Command('Content', command.method, { items: command.data.items.map(converter) })
			);
			command.data.items.should.deep.equal(['1']);
		});

		/* eslint-disable max-len */
		it('assigns a `reset` command to the event cell to make the first rendering include all collection items', function () {
		/* eslint-enable */
			var collection = new nx.Collection();
			var converter = function (item) { return nxt.Text(item); };
			collection.append('1');
			collection.append('3');
			collection.insertBefore('3', '2');
			var commandCell = new nxt.Collection(collection, converter);
			collection.command.value.should.not.deep.equal(
				new nx.Command('reset', { items: collection.items })
			);
			commandCell.value.should.deep.equal(
				new nxt.Command('Content', 'reset', { items: collection.items.map(converter) })
			);
		});

		it.skip('returns a command cell and event commands if item event handlers are passed', function () {
			var collection = new nx.Collection({ items: ['1', '2', '3'] });
			var handler = function () {};
			var converter = function (item) {
				return nxt.Element('li',
					nxt.Element('span',
						nxt.Text(item)
					)
				);
			};
			var items = nxt.Collection(collection, converter,
				nxt.ItemEvent('click', {
					'span': handler
				}),
				nxt.ItemEvent('mouseover', {
					'div': handler
				})
			);
			items.length.should.equal(3);
			items[0].value.should.deep.equal(
				new nxt.Command('Content', 'reset', { items: collection.items.map(converter) })
			);
			items[1].type.should.deep.equal('Event');
			items[1].method.should.deep.equal('add');
			items[2].type.should.deep.equal('Event');
			items[2].method.should.deep.equal('add');
		});

		it.skip('attaches delegated item event handlers', function (done) {
			var domContext = {
				container: document.createElement('ul')
			};
			document.body.appendChild(domContext.container);
			var collection = new nx.Collection({ items: ['a', 'b', 'c'] });
			var renderer = nxt.ContentRenderer;
			renderer.render({
				items: nxt.Collection(collection, function (item) {
						return nxt.Element('li',
							nxt.Element('span',
								nxt.Text(item)
							)
						);
					},
					nxt.ItemEvent('click', {
						'span': function (evt, item) {
							item.should.equal('c');
							document.body.removeChild(domContext.container);
							done();
						}
					})
				)
			}, domContext);
			domContext.container.childNodes[2].childNodes[0].click();
		});
	});

	describe('nxt.ValueBinding', function () {
		it('binds a cell with an input value bidirectionally', function () {
			var cell = new nx.Cell({ value: '' });
			var input = nxt.Element('input',
				nxt.ValueBinding(
					cell,
					function (value) {
						return value.toUpperCase();
					},
					function (value) {
						return value.toLowerCase();
					}
				)
			);
			input.data.node.value = 'CELLAR';
			var event = new Event('input');
			input.data.node.dispatchEvent(event);
			cell.value.should.equal('cellar');
			cell.value = 'door';
			input.data.node.value.should.equal('DOOR');

			// and once again, just in case
			input.data.node.value = 'CELLAR';
			event = new Event('input');
			input.data.node.dispatchEvent(event);
			cell.value.should.equal('cellar');
		});

		it('initializes input with cell value', function () {
			var cell = new nx.Cell({ value: 'cellar door' });
			var input = nxt.Element('input', nxt.ValueBinding(cell));
			input.data.node.value.should.equal('cellar door');
		});

		it('handles value binding when no converters are specified', function () {
			var cell = new nx.Cell({ value: '' });
			var input = nxt.Element('input', nxt.ValueBinding(cell));
			input.data.node.value = 'cellar';
			var event = new Event('input');
			input.data.node.dispatchEvent(event);
			cell.value.should.equal('cellar');
			cell.value = 'door';
			input.data.node.value.should.equal('door');

			// and once again, just in case
			input.data.node.value = 'cellar';
			event = new Event('input');
			input.data.node.dispatchEvent(event);
			cell.value.should.equal('cellar');
		});

		it('updates properly when a bound cell is continuously updated', function () {
			var cell = new nx.Cell();
			var input = nxt.Element('input', nxt.ValueBinding(cell));
			cell.value = 'cellar';
			input.data.node.value.should.equal('cellar');
			cell.value += ' door';
			input.data.node.value.should.equal('cellar door');
		});

		it('doesn\'t rerender the attribute when value is changed', function () {
			var cell = new nx.Cell();
			var conversionSpy = sinon.spy();
			var input = nxt.Element('input', nxt.ValueBinding(cell, conversionSpy));
			input.data.node.value = 'cellar';
			var event = new Event('input');
			input.data.node.dispatchEvent(event);
			/* eslint-disable no-unused-expressions */
			conversionSpy.should.not.have.been.calledWith('cellar');
			/* eslint-enable */
		});
	});

	describe('nxt.Style', function () {
		it('creates a style name-value command', function () {
			var command = nxt.Style({
				color: 'red',
				background: 'black'
			});
			command.type.should.equal('Style');
			command.method.should.equal('render');
			command.data.should.deep.equal({
				color: 'red',
				background: 'black'
			});
		});
	});

	describe('nxt.Fragment', function () {
		it('creates a document fragment with specified content', function () {
			var content = [
				nxt.Element('span'),
				nxt.Text('cellar door')
			];
			var command = nxt.Fragment(content);
			command.type.should.equal('Fragment');
			command.method.should.equal('render');
			command.data.fragment.nodeType.should.equal(Node.DOCUMENT_FRAGMENT_NODE);
			var childNodes = [].slice.call(command.data.fragment.childNodes);
			childNodes.should.deep.equal(content.map(function (item) { return item.data.node; }));
		});
	});

	describe('nxt.If', function () {
		it('returns its 2nd and further arguments if the first argument evaluates to true', function () {
			nxt.If(true, nxt.Element('a'), nxt.Element('b'))
				.should.deep.equal(nxt.Fragment(nxt.Element('a'), nxt.Element('b')));
			should.not.exist(nxt.If(false, nxt.Element('a')));
		});
	});

	describe('nxt.Focus', function () {
		it('adds an internal "nx-focus" attribute', function () {
			nxt.Focus(true).should.deep.equal(nxt.Attr('nx-focus', true));
		});
	});

});
