var nx = {
	Identity: require('../../src/core/identity')
};

describe('nx.Identity', function () {
	'use strict';

	it('returns its argument', function () {
		nx.Identity('cellar door').should.equal('cellar door');
		nx.Identity({ value: 0 }).should.deep.equal({ value: 0 });
	});
});
