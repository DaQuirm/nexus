var nx = {};

nx.OrderTreeNode = function (data, left, right, rank, parent) {
	return {
		data: data,
		left: left || null,
		right: right || null,
		rank: rank || 1,
		parent: parent || null
	};
};

module.exports = nx.OrderTreeNode;
