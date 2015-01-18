describe('nx.OrderTree', function () {

	var comparator = function (firstItem, secondItem) {
		return firstItem - secondItem;
	};

	describe('constructor', function () {
		it('creates a tree from a list by calling the build method', function () {
			var spy = sinon.spy(nx.OrderTree.prototype, 'build');
			var items = [4];

			var tree = new nx.OrderTree(items, comparator);
			tree.comparator.should.equal(comparator);
			spy.should.have.been.calledWith(items, comparator);
			spy.restore();
			tree.root.should.deep.equal(new nx.OrderTreeNode(4));
		});
	});

	describe('build', function () {
		it('creates a tree given a value list and a comparator', function () {
			var tree = new nx.OrderTree([], comparator);
			tree.build([4, 3, 5, 1, 2]);

			var nodes = {};
			nodes[4] = new nx.OrderTreeNode(4);
			nodes[3] = new nx.OrderTreeNode(3);
			nodes[5] = new nx.OrderTreeNode(5);
			nodes[1] = new nx.OrderTreeNode(1);
			nodes[2] = new nx.OrderTreeNode(2);

			nodes[4].left = nodes[3];
			nodes[4].right = nodes[5];
			nodes[4].rank = 5;

			nodes[3].left = nodes[1];
			nodes[3].rank = 3;
			nodes[3].parent = nodes[4];

			nodes[5].rank = 1;
			nodes[5].parent = nodes[4];

			nodes[1].right = nodes[2];
			nodes[1].rank = 2;
			nodes[1].parent = nodes[3];

			nodes[2].rank = 1;
			nodes[2].parent = nodes[1];

			tree.root.should.deep.equal(nodes[4]);
		});
	});

	describe('list', function () {
		it('returns tree items as a sorted value list', function () {
			var values = [4, 3, 5, 1, 2];
			var tree = new nx.OrderTree(values, comparator);
			tree.list().should.deep.equal([1, 2, 3, 4, 5]);
		});
	});

	describe('rank', function () {
		it('returns the position of an item in the sorted list of the tree elements', function () {
			var values = [4, 3, 5, 1, 2];
			var tree = new nx.OrderTree(values, comparator);
			var item = tree.root.left.left.right;
			tree.rank(item).should.equal(1);
			item = tree.root.right;
			tree.rank(item).should.equal(4);
			tree.rank(tree.root).should.equal(3);
		});
	});

	describe('insert', function () {
		it('inserts a new item into the tree', function () {
			var values = [4, 3, 5, 1, 2];
			var tree = new nx.OrderTree(values, comparator);
			tree.insert(3.5);
			tree.root.left.right.data.should.equal(3.5);
			tree.list().should.deep.equal([1, 2, 3, 3.5, 4, 5]);
		});

		it('returns new item\'s rank', function () {
			var values = [4, 3, 5, 1, 2];
			var tree = new nx.OrderTree(values, comparator);
			var rank = tree.insert(3.5);
			rank.should.equal(3);
		});
	});

});
