var Graph = require(__dirname + '/../src/graph.js');

exports.neighbors = function (test) {
	var g = new Graph;
	var n1 = g.addNode();
	var n2 = g.addNode();
	test.equal(0, n1.neighbors().length);
	test.equal(0, n2.neighbors().length);
	n1.link(n2);
	test.equal(1, n1.neighbors().length);
	test.equal(1, n2.neighbors().length);
	test.deepEqual(n2, n1.neighbors()[0]);
	test.deepEqual(n1, n2.neighbors()[0]);
	
	// Should replace the neighbor;
	n2.link(n1);
	test.equal(1, n2.neighbors().length);
	test.deepEqual(n1, n2.neighbors()[0]);
	test.done();
}

exports.graph = function (test) {
	var g = new Graph;
	var n1 = g.addNode(5);
	var n2 = g.addNode(3);
	g.link(n1, n2, { weight: 12 });
	test.equal(2, g.nodes().length);
	test.equal(1, g.edges().length);
	test.done();
}

exports.idLinks = function (test) {
	var g = new Graph;
	var n1 = g.addNode(24);
	var n2 = g.addNode(811);
	g.link(24, 811);
	test.deepEqual(n2, n1.neighbors()[0]);
	test.done();
}

exports.metadata = function (test) {
	var node = (new Graph).addNode();
	node.attribute('a', 'x');
	node.attribute('b', 'y');
	test.deepEqual({ a: 'x', b: 'y' }, node.meta());
	test.done();
}

exports.chaining = function (test) {
	var node = (new Graph).addNode().attribute("name", "Some node");
	test.deepEqual({ 'name' : 'Some node' }, node.meta());
	test.done();
}

exports.json = function (test) {
	var g = new Graph;
	var n1 = g.addNode(3).attribute("name", "Node 1");
	var n2 = g.addNode(7).attribute("name", "Node 2");
	n1.link(n2);
	var json = {
		"nodes" : [ { id: 3, name: "Node 1" }, { id: 7, name: "Node 2" } ],
		"edges" : [ { source: 0, target: 1 } ]
	};
	test.deepEqual(json, g.json());
	test.done();
}

exports.copyConstructor = function (test) {
    var g1 = new Graph();
	var n1 = g1.addNode(3).attribute("name", "Node 1");
	var n2 = g1.addNode(7).attribute("name", "Node 2");
    n1.link(n2);
    
    var g2 = new Graph(g1.json(), Graph.INDEXED);
    test.deepEqual(g2.json(), g1.json());
    test.done();
}

exports.addNodeMeta = function (test) {
    var g = new Graph;
    var n = g.addNode({ id: 7, a: "x" });
    test.deepEqual(g.json(), { nodes: [{ id: 7, a: "x" }], edges: [] });
    test.equal(7, n.get('id'));
    test.done();
}

exports.eachNode = function (test) {
    var g = new Graph;
    for (var i = 0; i < 17; i++) {
        var n = g.addNode();
        n.set('name', 'Node' + i);
    }
    var counter = 0;
    g.eachNode(function (node) {
        test.deepEqual({ name : "Node" + counter }, node.meta());
        counter++;
    });
    test.equal(17, counter);
    test.done();
}

exports.findEdge = function (test) {
    var g = new Graph;
    var n1 = g.addNode({ color: "blue", shape: "circle" });
    var n2 = g.addNode({ color: "green", shape: "square" });
    n1.link(n2);
    var edge = g.findEdge({ color: "blue" }, { shape: "square" });
    test.deepEqual(n1, edge.source);
    test.deepEqual(n2, edge.target);
    test.ok(null === g.findEdge({ color: "blue"}, { shape: "circle" }));
    test.done();
}

exports.transferNode = function (test) {
    var g1 = new Graph;
    var n1 = g1.addNode(1);
    var n2 = g1.addNode(2);
    
    var g2 = new Graph;
    var n3 = g2.addNode(n1);
    var n4 = g2.addNode(n2);
    test.deepEqual(n1.meta(), n3.meta());
    test.deepEqual(n2.meta(), n4.meta());
    test.done();
}