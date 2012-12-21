define(['jquery', 'util/eventemitter'], function ($, EventEmitter) {
    function DragBox(element) {
        var self = this;
        element = $(element);

        var tool = new Object();
        tool.started = false;
        
        var handlers = {
            selection: function () {},
            pinpoint:  function () {}
        };

        var canvas = $("<canvas>")
            .attr("width", element.width())
            .attr("height", element.height())
            .css("position", "absolute")
            .css("left", 0)
            .css("top", 0)
            .css("z-index", 1);
        element.append(canvas);
        
        canvas.on('mousedown', startDrag);
        canvas.on('mousemove', moveDragEvent);
        canvas.on('mouseup',   releaseDragEvent);
        
        var offset = element.offset();
        var context = canvas[0].getContext('2d');
        context.strokeStyle = "red";
        context.lineWidth = 0.5;
        context.fillStyle = "rgba(255,0,0,0.2)";

        function startDrag(ev) {
            if (tool.clicked) {
                tool.clicked = false;
                return;
            }
            ev._x = ev.pageX - offset.left;
            ev._y = ev.pageY - offset.top;
            tool.clicked = true;
            tool.started = false;
            tool.x = ev._x;
            tool.y = ev._y;
            context.clearRect(0, 0, element.width(), element.height());
            context.strokeRect(tool.x, tool.y, 1, 1);
        }

        function moveDragEvent(ev) {
            if (!tool.clicked) return;
            tool.started = true;
            ev._x = ev.pageX - offset.left;
            ev._y = ev.pageY - offset.top;
            var x = Math.min(tool.x, ev._x);
            var y = Math.min(tool.y, ev._y);
            var width = Math.abs(ev._x - tool.x + 1);
            var height = Math.abs(ev._y - tool.y + 1);
            context.clearRect(0, 0, element.width(), element.height());
            context.fillRect(x, y, width, height);
            context.strokeRect(x, y, width, height);
        }

        function releaseDragEvent(ev) {
            ev._x = ev.pageX - offset.left;
            ev._y = ev.pageY - offset.top;
            var x1 = Math.min(tool.x, ev._x);
            var x2 = Math.max(tool.x, ev._x);
            var y1 = Math.min(tool.y, ev._y);
            var y2 = Math.max(tool.y, ev._y);
            if (!tool.started) {
                handlers.pinpoint(x2, y2);
            } else {
                tool.started = false;
                // self.emit("selection", [x1, y1, x2, y2]);
                handlers.selection(x1, y1, x2, y2);
            }
            tool.clicked = false;
        };
        self.selectionHandler = function (callback) {
            handlers.selection = callback;
        };
        self.pinpointHandler = function (callback) {
            handlers.pinpoint = callback;
        };
    }
    $.extend(DragBox.prototype, EventEmitter);
    return DragBox;
    
})