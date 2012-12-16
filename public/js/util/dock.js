define(['jquery', 'd3'], function ($, d3) {
    
    var DOCK_DELAY = 500; // 1 seconds

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
            .on("click", dockHud);

        self.changedState = false;
        
        self.updateHud = function () {
            var $hud = $("#dockHud");
            $hud.empty();
            $hud.append("<h4>Dock</h4>");
            for (d in docked) {
                $hud.append("<li>" + d + "</li>");
            }            
        }
        
        function dockHud() {
            self.updateHud();
            var $hud = $("#dockHud");
            $hud.fadeIn();
            $hud.on("click", function () {
                $hud.fadeOut();
            });
        }
        
        self.intersects = function (d) {
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
          
        /*      
        function handleDock(d) {
            if (!dragging) return;
            if (!draggedNode) return;
            var selected = d3.select(draggedNode);
            if (intersectsDock(d) &&
                (!intersectsDock(dragStart) || changedDockState)) {
                selected
                    .style("stroke", "yellow")
                    .style("stroke-width", 3)
                    .style("stroke-location", "outside")
                    // .attr("class", "docked");
                    // .attr("filter", "url(#dockStyle)");

                d.fixed = true;
                docked[d.name] = d;
                updateDockHud();
                changedDockState = true;
                draggedNode = null;
            }
            if (!intersectsDock(d) &&
                (intersectsDock(dragStart) || changedDockState)) {
                    selected
                        .style("stroke", null)
                        .style("stroke-width", null)
                        .style("stroke-location", null);
                        // .attr("class", null);
                        // .attr("filter", null);
                    
                    delete docked[d.name];
                    updateDockHud();
                    changedDockState = true;
                    setTimeout(function () {
                        d.fixed = false;
                    }, DOCK_DELAY);
                    draggedNode = null;
            }
        }
        */
    };
    return Dock;
});