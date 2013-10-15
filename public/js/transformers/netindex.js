define(["underscore"], function (_) {
    "use strict";
    function NetworkIndex(data) {
        var result = {};
        for (var property in data) {
            if (data.hasOwnProperty(property)) {
                result[property] = data[property];
            }
        }
        result.nodes = [];
        result.edges = [];
        var nodeMap = {};
        for (var i = 0; i < data.nodes.length; i++) {
            var node = _.extend({}, data.nodes[i]);
            nodeMap[node.id] = i;
            node.kbid = node.id;
            node.group = node.type;
            node.id = i;
            result.nodes.push(node);
        }
        for (var i = 0; i < data.edges.length; i++) {
            var edge = _.extend({}, data.edges[i]);
            edge.source = parseInt(nodeMap[edge.nodeId1], 0);
            edge.target = parseInt(nodeMap[edge.nodeId2], 0);
            edge.weight = 1;
            result.edges.push(edge);
        }
        for (var prop in data) {
            if (!result.hasOwnProperty(prop)) {
                result[prop] = data[prop];
            }
        }
        return result;
    }
    return NetworkIndex;
});