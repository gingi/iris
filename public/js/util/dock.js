define(['jquery', 'd3', 'util/eventemitter', 'util/hud'],
function (JQ, d3, EventEmitter, HUD) {
    
    var DOCK_HEIGHT = 30;
    var Dock = function (parentElement) {  
        var self = this;

        var parent;
        var dock;
        var dockDims;
        var docked = {};
        var updateActions = [];
        if (parent) { setParent(parent) }
        var dockRenderPromise = JQ.Deferred();
        
        var dockHudContentCallback = function (nodes) {
            var dock = this;
            var list = JQ("<ul>");
            dock.hud.append(list);
            nodes.forEach(function (d) {
                list.append("<li>" + d.name + "</li>");
            });
        }
        
        function dockDragStart() {
            this._elemOffsets = [];
            this._yoffset = d3.event.sourceEvent.pageY - dockDims.y1;
            for (var key in docked) {
                this._elemOffsets[key] = docked[key][0].py - dockDims.y1;
            }
        }
        
        function dockDrag() {
            dock.attr("y", dockDims.y1 = d3.event.y - this._yoffset);
            for (var key in docked) {
                var el = docked[key];
                var y = dockDims.y1 + this._elemOffsets[key];
                el[1].attr("cy", y);
                el[0].py = el[0].y = y;
            }
        }
        
        function dockDragEnd() {
            for (var key in docked) {
                var el = docked[key];
                var y = dockDims.y1 + this._elemOffsets[key];
                el[1].attr("cy", y);
                el[0].py = el[0].y = y;
            }
            dockDims.y2 = dockDims.y1 + dockDims.h;
        }

        self.setParent = function (parentElement) {
            parent = parentElement;
            var w = parent.attr("width");
            var h = parent.attr("height");
            dockDims = { x1: w / 4, y1: h / 2, w: w / 2, h: DOCK_HEIGHT };
            dockDims.x2 = dockDims.x1 + dockDims.w; // For convenience
            dockDims.y2 = dockDims.y1 + dockDims.h; // For convenience
            dock = parent.append("rect")
                .attr("id", "networkDock")
                .attr("width",  dockDims.w)
                .attr("height", dockDims.h)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("x", dockDims.x1)
                .attr("y", dockDims.y1)
                .style("fill", "black")
                .style("opacity", "0.1")
                .call(d3.behavior.drag()
                    .on("dragstart", dockDragStart)
                    .on("drag", dockDrag)
                    .on("dragend", dockDragEnd)
                );
            
            dock
                .on("mouseover", function () { dock.style("opacity", 0.2); })
                .on("mouseout",  function () { dock.style("opacity", 0.1); })
                .on("click", dockhud);

            self.changedState = false;
            dockRenderPromise.resolve();
            return self;
        }
        
        var hud = self.hud = new HUD({
            width: 300,
            position: { top: 120, right: 20 },
            title: "Dock",
            draggable: true
        });
        
        self.updateHud = function () {
            hud.empty();
            var nodes = [];
            for (var key in docked) {
                nodes.push(docked[key][0]);
            }
            dockHudContentCallback.call(self, nodes);
            updateActions.forEach(function (callback) {
                callback.call(self, nodes);
            });
        }
        
        function dockhud() {
            self.updateHud();
            hud.show();
        }
        
        self.drag = function () {
            return d3.behavior.drag()
                .on("dragstart", nodeDragstart)
                .on("drag",      nodeDragmove)
                .on("dragend",   nodeDragend);
        }

        function nodeDragstart() {
            self.emit("dragstart.dock");
        }
        
        function nodeDragmove(d) {
            d.px += d3.event.dx;
            d.py += d3.event.dy;
            d.x += d3.event.dx;
            d.y += d3.event.dy; 
            self.emit("dragmove.dock", d);
        }
        
        function nodeDragend(d) {
            var draggedNode = this;
            var selected = d3.select(draggedNode);
            if (intersects(d)) {
                self.dockElement(d, selected);
            } else {
                self.undockElement(d, selected);
            }
            self.emit("dragend.dock", d);
        }
        
        function intersects(d, a) {
            a = (a || "");
            var x = a + "x";
            var y = a + "y";
            return d[x] >= dockDims.x1 &&
                   d[x] <= dockDims.x2 &&
                   d[y] >= dockDims.y1 &&
                   d[y] <= dockDims.y2
        }
        
        self.dockElement = function (d, element) {
            if (d == null) {
                throw Error("Cannot dock a null element");
            }
            d.fixed = true;
            docked[d.id] = [d, element];
            self.updateHud();
            self.emit("dock", [d, element]);             
        }
        
        self.undockElement = function (d, element) {
            if (d == null) {
                throw Error("Cannot undock a null element");
            }
            d.fixed = false;
            delete docked[d.id];
            self.updateHud();
            self.emit("undock", [d, element]);
        }
        
        self.reset = function () {
            hud.empty().dismiss();
            docked = {};
        }
        
        self.set = function (nodes) {
            self.reset();
            dockRenderPromise.then(function () {
                var interval = dock.attr('width') / (nodes.length + 1);
                for (var i = 0; i < nodes.length; i++) {
                    var element = parent.select("#" + nodes[i].elementId);
                    self.dockElement(nodes[i], element);
                    nodes[i].px = dockDims.x1 + (i+1) * interval
                    nodes[i].py = (dockDims.y1 + dockDims.y2) / 2;
                }
            })
        }
        self.get = function () {
            var nodes = [];
            for (var key in docked) {
                nodes.push(docked[key][0]);
            }
            return nodes;
        }
        self.addUpdateAction = function (callback) {
            updateActions.push(callback);
        }
        self.hudContent = function (callback) {
            dockHudContentCallback = callback;
        }
        self.showHUD = dockhud;
    };
    
    JQ.extend(Dock.prototype, EventEmitter);
    return Dock;
});