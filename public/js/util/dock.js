define(['jquery', 'd3', 'util/eventemitter', 'util/hud'],
function ($, d3, EventEmitter, HUD) {
    
    var DOCK_HEIGHT = 30;
    var Dock = function (element) {  
        var self = this;

        var docked = {};
        var updateActions = [];
        
        var dockHudContentCallback = function (nodes) {
            var dock = this;
            var list = $("<ul>");
            dock.hud.append(list);
            nodes.forEach(function (d) {
                list.append("<li>" + d + "</li>");
            });
        }
        
        function dockDragStart() {
            this._elemOffsets = [];
            this._yoffset = d3.event.sourceEvent.pageY - dockDims.y1;
            for (var n in docked) {
                this._elemOffsets[n] = docked[n][0].py - dockDims.y1;
            }
        }
        
        function dockDrag() {
            dock.attr("y", dockDims.y1 = d3.event.y - this._yoffset);
            for (var name in docked) {
                var el = docked[name];
                var y = dockDims.y1 + this._elemOffsets[name];
                el[1].attr("cy", y);
                el[0].py = el[0].y = y;
            }
        }
        
        function dockDragEnd() {
            for (var name in docked) {
                var el = docked[name];
                var y = dockDims.y1 + this._elemOffsets[name];
                el[1].attr("cy", y);
                el[0].py = el[0].y = y;
            }
            dockDims.y2 = dockDims.y1 + dockDims.h;
        }

        var w = element.attr("width");
        var h = element.attr("height");
        var dockDims = { x1: w / 4, y1: h / 2, w: w / 2, h: DOCK_HEIGHT };
        dockDims.x2 = dockDims.x1 + dockDims.w; // For convenience
        dockDims.y2 = dockDims.y1 + dockDims.h; // For convenience
        var dock = element.append("rect")
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
        
        var hud = self.hud = new HUD({
            width: 300,
            position: { top: 50, right: 20 },
        });
        
        self.updateHud = function () {
            hud.empty();
            hud.append("<h4>Dock</h4>");
            var nodes = [];
            for (var d in docked) {
                nodes.push(d);
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
        
        function intersects(d) {
            return d.px >= dockDims.x1 &&
                   d.px <= dockDims.x2 &&
                   d.py >= dockDims.y1 &&
                   d.py <= dockDims.y2
        }
        
        self.dockElement = function (d, element) {
            if (d == null) {
                throw Error("Cannot dock a null element");
            }
            d.fixed = true;
            docked[d.name] = [d, element];
            self.updateHud();
            self.emit("dock", [d, element]);             
        }
        
        self.undockElement = function (d, element) {
            if (d == null) {
                throw Error("Cannot undock a null element");
            }
            d.fixed = false;
            delete docked[d.name];
            self.updateHud();
            self.emit("undock", [d, element]);
        }
        
        self.reset = function () {
            for (var d in docked)
                self.undockElement(docked[d][0], docked[d][1]);
        }
        
        self.set = function (nodes) {
            self.reset();
            var interval = dock.attr('width') / (nodes.length + 1);
            for (var i = 0; i < nodes.length; i++) {
                var element = d3.select("#" + nodes[i].elementId)
                self.dockElement(nodes[i], element);
                nodes[i].px = dockDims.x1 + (i+1) * interval
                nodes[i].py = (dockDims.y1 + dockDims.y2) / 2;
            }
        }
        self.addUpdateAction = function (callback) {
            updateActions.push(callback);
        }
        self.hudContent = function (callback) {
            dockHudContentCallback = callback;
        }
    };
    
    $.extend(Dock.prototype, EventEmitter);
    return Dock;
});