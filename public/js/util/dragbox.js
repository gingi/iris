define(['jquery', 'util/eventemitter'], function ($, EventEmitter) {
    var FGCOLOR = "red";
    function DragBox(element, options) {
        var self = this;
        options = (options || {})
        element = $(element);

        var tool = new Object();
        tool.started = false;
        
        var handlers = {
            selection: function () {},
            pinpoint:  function () {},
            text:      null
        };

        var canvas = $("<canvas>")
            .attr("width", element.width())
            .attr("height", element.height())
            .css("position", "absolute")
            .css("left", 0)
            .css("top", 0)
            .css("z-index", options.z || 10)
            .addClass("dragbox");
        element.append(canvas);
        
        canvas.on('mousedown', startDrag);
        canvas.on('mousemove', moveDragEvent);
        canvas.on('mouseup',   releaseDragEvent);
        
        var offset = element.offset();
        var context = canvas[0].getContext('2d');
        context.strokeStyle = FGCOLOR;
        context.lineWidth = 0.5;
        context.fillStyle = "rgba(255,0,0,0.2)";

        function boxInfo(text, x, y) {
            context.save();
            context.textBaseline = 'middle';
            context.textAlign = 'center';
            context.fillStyle = FGCOLOR;
            context.fillText(text, x, y);
            context.restore();
        }
        
        function drawDragBox(x, y, w, h) {
            context.clearRect(0, 0, element.width(), element.height());
            context.fillRect(x, y, w, h);
            context.strokeRect(x, y, w, h);
            if (handlers.text && typeof(handlers.text) === 'function') {
                var text = handlers.text(x, y, w, h);
                boxInfo(text, x + w / 2, y + h / 2);
            }
        }

        function startDrag(ev) {
            ev.preventDefault();
            offset = element.offset();
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
        }
        

        function moveDragEvent(ev) {
            ev.preventDefault();
            if (!tool.clicked) return;
            tool.started = true;
            ev._x = ev.pageX - offset.left;
            ev._y = ev.pageY - offset.top;
            var x = Math.min(tool.x, ev._x);
            var y = Math.min(tool.y, ev._y);
            var width = Math.abs(ev._x - tool.x + 1);
            var height = Math.abs(ev._y - tool.y + 1);
            drawDragBox(x, y, width, height);
        }

        function releaseDragEvent(ev) {
            context.clearRect(0, 0, element.width(), element.height());
            ev._x = ev.pageX - offset.left;
            ev._y = ev.pageY - offset.top;
            var x1 = Math.min(tool.x, ev._x);
            var x2 = Math.max(tool.x, ev._x);
            var y1 = Math.min(tool.y, ev._y);
            var y2 = Math.max(tool.y, ev._y);
            if (!tool.started) {
                handlers.pinpoint(x2, y2);
            } else {
                drawDragBox(x1, y1, x2 - x1 + 1, y2 - y1 + 1)
                tool.started = false;
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
        self.textHandler = function (callback) {
            handlers.text = callback;
        }
    }
    $.extend(DragBox.prototype, EventEmitter);
    return DragBox;
    
})