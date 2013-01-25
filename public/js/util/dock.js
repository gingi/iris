define(['jquery', 'd3', 'util/eventemitter', 'util/hud'],
function ($, d3, EventEmitter, HUD) {
    
    var Dock = function (element) {  
        var self = this;

        var docked = {};

        var w = element.attr("width");
        var h = element.attr("height");
        var dock = element.append("rect")
            .attr("id", "networkDock")
            .attr("width", w / 2)
            .attr("height", 30)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("x", (w - 600) / 2)
            .attr("y", h * 5 / 6)
            .style("fill", "black")
            .style("opacity", "0.1");
        var dockDims = {
            x1: parseInt(dock.attr("x")),
            x2: parseInt(dock.attr("x")) + parseInt(dock.attr("width")),
            y1: parseInt(dock.attr("y")),
            y2: parseInt(dock.attr("y")) + parseInt(dock.attr("height")),
        };
            
        dock
            .on("mouseover", function () { dock.style("opacity", "0.2"); })
            .on("mouseout",  function () { dock.style("opacity", "0.1"); })
            .on("click", dockhud);

        self.changedState = false;
        
        var hud = new HUD({
            width: 300,
            position: { top: 50, right: 20 },
        });
        
        self.updateHud = function () {
            hud.empty();
            hud.append("<h4>Dock</h4>");
            var list = $("<ul>");
            hud.append(list);
            for (d in docked) {
                list.append("<li>" + d + "</li>");
            }            
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
                self.dockElement(d);
                self.emit("dock", [d, selected]);             
            } else {
                self.undockElement(d);
                self.emit("undock", [d, selected]);
            }
            self.emit("dragend.dock", d);
        }
        
        function intersects(d) {
            return d.px >= dockDims.x1 &&
                   d.px <= dockDims.x2 &&
                   d.py >= dockDims.y1 &&
                   d.py <= dockDims.y2
        }
        
        self.dockElement = function (d) {
            if (d == null) {
                throw Error("Cannot dock a null element");
            }
            d.fixed = true;
            docked[d.name] = d;
            self.updateHud();
        }
        
        self.undockElement = function (d) {
            if (d == null) {
                throw Error("Cannot undock a null element");
            }
            d.fixed = false;
            delete docked[d.name];
            self.updateHud();
        }
    };
    
    $.extend(Dock.prototype, EventEmitter);
    return Dock;
});