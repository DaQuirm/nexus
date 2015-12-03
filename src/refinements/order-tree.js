var nx = {
	OrderTreeNode: require('./order-tree-node')
};

nx.OrderTree = function (values, comparator) {
	this.comparator = comparator;
	this.build(values);
};

nx.OrderTree.ComparisonResult = {
	LESS: -1,
	EQUAL: 0,
	MORE:  1
};

nx.OrderTree.Direction = {
	LEFT:  'left',
	RIGHT: 'right'
};

nx.OrderTree.prototype.build = function (values) {
	this.root = new nx.OrderTreeNode(values[0]);
	for (var index = 1; index < values.length; index++) {
		this.insert(values[index]);
	}
};

nx.OrderTree.prototype.list = function () {
	var stack = [];
	var node = this.root;
	var list = [];

	while (stack.length > 0 || node !== null) {
		if (node !== null) {
			stack.push(node);
			node = node.left;
		}
		else {
			node = stack.pop();
			list.push(node.data);
			node = node.right;
		}
	}
	return list;
};

nx.OrderTree.prototype.rank = function (node) {
	var rank = 0;
	if (node.left !== null) {
		rank = node.left.rank;
	}
	var current = node;
	while (current !== this.root) {
		if (current === current.parent.right) {
			rank++;
			if (current.parent.left !== null) {
				rank += current.parent.left.rank;
			}
		}
		current = current.parent;
	}
	return rank;
};

nx.OrderTree.prototype.insert = function (value) {
	var target = null;
	var current = this.root;
	var direction = null;
	var compareResult;
	while (current !== null) {
		target = current;
		current.rank++;
		compareResult = Math.sign(this.comparator(value, current.data));
		switch (compareResult) {
			case nx.OrderTree.ComparisonResult.LESS:
			case nx.OrderTree.ComparisonResult.EQUAL:
				direction = nx.OrderTree.Direction.LEFT;
				break;

			case nx.OrderTree.ComparisonResult.MORE:
				direction = nx.OrderTree.Direction.RIGHT;
				break;
		}
		current = current[direction];
	}
	var node = target[direction] = new nx.OrderTreeNode(value);
	node.parent = target;
	return this.rank(node);
};

nx.OrderTree.prototype.find = function (value) {
	var current = this.root;
	var compareResult, direction;
	while (current !== null && current.data !== value) {
		compareResult = Math.sign(this.comparator(value, current.data));
		switch (compareResult) {
			case nx.OrderTree.ComparisonResult.LESS:
			case nx.OrderTree.ComparisonResult.EQUAL:
				direction = nx.OrderTree.Direction.LEFT;
				break;

			case nx.OrderTree.ComparisonResult.MORE:
				direction = nx.OrderTree.Direction.RIGHT;
				break;
		}
		current = current[direction];
	}
	return current;
};

nx.OrderTree.prototype._replaceParent = function (node, child) {
	if (node === node.parent.left) {
		node.parent.left = child;
	} else {
		node.parent.right = child;
	}
};

nx.OrderTree.prototype.remove = function (node) {
	var current = node;
	var rank = this.rank(node);

	while (current !== this.root) {
		current.rank--;
		current = current.parent;
	}

	if (node.left !== null && node.right !== null) {
		current = node.right;
		while (current.left !== null) {
			current = current.left;
		}
		node.data = current.data;
		this.remove(current);
	} else if (node.left !== null) {
		this._replaceParent(node, node.left);
	} else if (node.right !== null) {
		this._replaceParent(node, node.right);
	} else {
		this._replaceParent(node, null);
	}
	return rank;
};

module.exports = nx.OrderTree;
