nx.OrderTree = function (values, comparator) {
	this.comparator = comparator;
	this.build(values, comparator);
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

nx.OrderTree.prototype.build = function (values, comparator) {
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
	var rank = 0;
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
				rank += current.rank - 1;
				break;
		}
		current = current[direction];
	}
	var node = target[direction] = new nx.OrderTreeNode(value);
	node.parent = target;
	return rank;
};
