// var requirejs = require('../client-require');
var assert = require('assert');
var Graph = require(__dirname + '/../../src/graph.js');

describe("Graph", function () {
    it("should have neighbors", function (done) {
    	var g = new Graph;
    	var n1 = g.addNode();
    	var n2 = g.addNode();
    	n1.neighbors().length.should.equal(0);
    	n2.neighbors().length.should.equal(0);
    	n1.link(n2);
    	n1.neighbors().length.should.equal(1);
    	n2.neighbors().length.should.equal(1);
    	n1.neighbors()[0].should.eql(n2);
    	n2.neighbors()[0].should.eql(n1);
	
    	// Should replace the neighbor;
    	n2.link(n1);
    	n2.neighbors().length.should.equal(1);
    	n2.neighbors()[0].should.eql(n1);
    	done();
    })

    it("should have graph", function (done) {
    	var g = new Graph;
    	var n1 = g.addNode(5);
    	var n2 = g.addNode(3);
    	g.link(n1, n2, { weight: 12 });
    	g.nodes().length.should.equal(2);
    	g.edges().length.should.equal(1);
    	done();
    })

    it("should have idLinks", function (done) {
    	var g = new Graph;
    	var n1 = g.addNode(24);
    	var n2 = g.addNode(811);
    	g.link(24, 811);
    	n1.neighbors()[0].should.eql(n2);
    	done();
    })

    it("should have metadata", function (done) {
    	var node = (new Graph).addNode();
    	node.attribute('a', 'x');
    	node.attribute('b', 'y');
    	node.meta().should.eql({ a: 'x', b: 'y' });
    	done();
    })

    it("should have chaining", function (done) {
    	var node = (new Graph).addNode().attribute("name", "Some node");
    	node.meta().should.eql({ 'name' : 'Some node' });
    	done();
    })

    it("should have json", function (done) {
    	var g = new Graph;
    	var n1 = g.addNode(3).attribute("name", "Node 1");
    	var n2 = g.addNode(7).attribute("name", "Node 2");
    	n1.link(n2);
    	var json = {
    		"nodes" : [ { id: 3, name: "Node 1" }, { id: 7, name: "Node 2" } ],
    		"edges" : [ { source: 0, target: 1 } ]
    	};
    	g.json().should.eql(json);
    	done();
    })

    it("should have copyConstructor", function (done) {
        var g1 = new Graph();
    	var n1 = g1.addNode(3).attribute("name", "Node 1");
    	var n2 = g1.addNode(7).attribute("name", "Node 2");
        n1.link(n2);
    
        var g2 = new Graph(g1.json(), Graph.INDEXED);
        g1.json().should.eql(g2.json());
        done();
    })

    it("should have addNodeMeta", function (done) {
        var g = new Graph;
        var n = g.addNode({ id: 7, a: "x" });
        g.json().should.eql({ nodes: [{ id: 7, a: "x" }], edges: [] });
        n.get('id').should.equal(7);
        done();
    })

    it("should have eachNode", function (done) {
        var g = new Graph;
        for (var i = 0; i < 17; i++) {
            var n = g.addNode();
            n.set('name', 'Node' + i);
        }
        var counter = 0;
        g.eachNode(function (node) {
            node.meta().should.eql({ name : "Node" + counter });
            counter++;
        });
        counter.should.equal(17);
        done();
    })

    it("should have findEdge", function (done) {
        var g = new Graph;
        var n1 = g.addNode({ color: "blue", shape: "circle" });
        var n2 = g.addNode({ color: "green", shape: "square" });
        n1.link(n2);
        var edge = g.findEdge({ color: "blue" }, { shape: "square" });
        edge.source.should.eql(n1);
        edge.target.should.eql(n2);
        assert(!g.findEdge({ color: "blue"}, { shape: "circle" }));
        done();
    })

    it("should have transferNode", function (done) {
        var g1 = new Graph;
        var n1 = g1.addNode(1);
        var n2 = g1.addNode(2);
    
        var g2 = new Graph;
        var n3 = g2.addNode(n1);
        var n4 = g2.addNode(n2);
        n3.meta().should.eql(n1.meta());
        n4.meta().should.eql(n2.meta());
        done();
    })

    it("should have transferEdge", function (done) {
        var g1 = new Graph;
        var n0 = g1.addNode({ desc: "Just throwing off the indexes" });
        var n1 = g1.addNode(1);
        var n2 = g1.addNode(2);
        n1.link(n2);
        var edge = g1.findEdge(n1, n2);
    
        var g2 = new Graph;
        var n3 = g2.addNode(n1);
        var n4 = g2.addNode(n2);
        var newEdge = g2.addEdge(edge);
        edge.source.should.eql(n1);
        edge.target.should.eql(n2);
        newEdge.source.should.eql(n3);
        newEdge.target.should.eql(n4);
        done();
    })
})
