var _ = require('lodash');

var nxt = _.assign(
	{
		FragmentRenderer: require('../../../src/nxt/renderers')('FragmentRenderer')
	},
	require('../../../src/nxt/helpers')
);

describe('nxt.FragmentRenderer', function () {
	'use strict';

	var renderer = nxt.FragmentRenderer;
	var domContext;

	beforeEach(function () {
		domContext = { container: document.createElement('div') };
	});

	describe('render', function () {
		/* eslint-disable max-len */
		it('appends a fragment to the container if there is no insert reference and no previously rendered content', function () {
		/* eslint-enable */
			renderer.render(new nxt.Fragment([
				nxt.Element('div', nxt.Text('cellar')),
				nxt.Element('span', nxt.Text(' door'))
			]).data, domContext);
			domContext.container.childNodes.length.should.equal(2);
			domContext.container.textContent.should.equal('cellar door');
		});

		it('returns an array of rendered nodes', function () {
			var content = renderer.render(new nxt.Fragment([
				nxt.Element('div', nxt.Text('cellar')),
				nxt.Element('span', nxt.Text('door'))
			]).data, domContext);
			content.map(function (node) { return node.nodeName.toLowerCase(); })
				.should.deep.equal(['div', 'span']);
			content.map(function (node) { return node.textContent; })
				.should.deep.equal(['cellar', 'door']);
			content.map(function (node) { return node.parentElement; })
				.should.deep.equal([domContext.container, domContext.container]);
		});

		it('replaces previously rendered document fragment', function () {
			var content = renderer.render(new nxt.Fragment([
				nxt.Element('div', nxt.Text('before')),
				nxt.Element('span')
			]).data, domContext);
			domContext.container.textContent.should.equal('before');
			domContext.content = content;
			content = renderer.render(new nxt.Fragment([
				nxt.Element('div', nxt.Text('after')),
				nxt.Element('span')
			]).data, domContext);
			domContext.container.textContent.should.equal('after');
		});

		it('inserts an element node before another node if an insert reference has been set', function () {
			var movieNode = document.createElement('span');
			movieNode.textContent = 'Lethal Weapon II';
			domContext.container.appendChild(movieNode);
			domContext.insertReference = movieNode;

			renderer.render(new nxt.Fragment([
				nxt.Element('span', nxt.Text('Lethal Weapon I')),
				nxt.Element('div')
			]).data, domContext);

			domContext.container.childNodes.length.should.equal(3);
			domContext.container.childNodes[0].textContent.should.equal('Lethal Weapon I');
			domContext.container.childNodes[0].nodeName.toLowerCase().should.equal('span');
			domContext.container.childNodes[2].textContent.should.equal('Lethal Weapon II');
			domContext.container.childNodes[2].nodeName.toLowerCase().should.equal('span');
		});

		it('replaces existing content even if insert reference is present', function () {
			var movieNode = document.createElement('span');
			movieNode.textContent = 'Lethal Weapon II';
			domContext.container.appendChild(movieNode);
			domContext.insertReference = movieNode;

			domContext.content = renderer.render(new nxt.Fragment([
				nxt.Element('span', nxt.Text('Beverly Hills Cop')),
				nxt.Element('div')
			]).data, domContext);

			renderer.render(new nxt.Fragment([
				nxt.Element('span', nxt.Text('Lethal Weapon I')),
				nxt.Element('div')
			]).data, domContext);

			domContext.container.childNodes.length.should.equal(3);
			domContext.container.childNodes[0].textContent.should.equal('Lethal Weapon I');
			domContext.container.childNodes[0].nodeName.toLowerCase().should.equal('span');
			domContext.container.childNodes[2].textContent.should.equal('Lethal Weapon II');
			domContext.container.childNodes[2].nodeName.toLowerCase().should.equal('span');
		});
	});

	describe('isVisible', function () {
		it('returns true for non-empty fragment content', function () {
			renderer.visible([document.createElement('a')]).should.equal(true);
			renderer.visible([document.createTextNode('a')]).should.equal(true);
			renderer.visible(undefined).should.equal(false);
		});
	});

	describe('unrender', function () {
		it('removes fragment nodes from the container', function () {
			var node = document.createElement('span');
			node.textContent = 'cellar door';
			domContext.container.appendChild(node);
			domContext.insertReference = node;

			domContext.content = renderer.render(new nxt.Fragment([
				nxt.Element('div', nxt.Text('*')),
				nxt.Element('span', nxt.Text('**'))
			]).data, domContext);
			renderer.unrender(domContext);
			domContext.container.childNodes.length.should.equal(1);
			domContext.container.textContent.should.equal('cellar door');
		});
	});
});
