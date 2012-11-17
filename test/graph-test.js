var graph = require(__dirname + '/../src/graph.js');

exports.neighbors = function (test) {
	var n1 = graph.createNode();
	var n2 = graph.createNode();
	test.equal(0, n1.neighbors().length);
	test.equal(0, n2.neighbors().length);
	n1.add(n2);
	test.equal(1, n1.neighbors().length);
	test.equal(1, n2.neighbors().length);
	test.equal(n2, n1.neighbors()[0]);
	test.equal(n1, n2.neighbors()[0]);
	
	// Should replace the neighbor;
	n2.add(n1);
	test.equal(1, n2.neighbors().length);
	test.equal(n1, n2.neighbors()[0]);
	test.done();
}

exports.metadata = function (test) {
	var node = graph.createNode();
	node.attribute('a', 'x');
	node.attribute('b', 'y');
	test.deepEqual({ a: 'x', b: 'y' }, node.meta());
	test.done();
}
