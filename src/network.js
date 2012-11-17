var neighbors = {};

function addNeighbors(n1, n2) {
	var n1n = neighbors[n1];
	var n2n = neighbors[n2];

	n1n[n2] = 1;
	n2n[n1] = 1;
}

function Node() {
	var meta = {};
	var node = {
		neighbors: function () {
			var arr = [];
			for (var obj in neighbors[this]) {
				arr.push(obj);
			}
			return arr;
		},
		add: function (neighbor) {
			addNeighbors(this, neighbor);
		},
		attribute: function (key, val) {
			meta[key] = val;
		},
		meta: function () { return meta; }
	};
	neighbors[node] = {};
	return node;
}

exports.createNode = function () {
	return new Node();
}