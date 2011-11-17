$(function() {
    // Grab the data
    $.getJSON('/api/fastbit', {},
        function(json) {
            draw(json);
        }
    );
    function draw(json) {
        var axisx = [], axisy = [],        
            width = 800,
            height = 400,
            leftgutter = 30,
            bottomgutter = 20,
            r = Raphael("chart", width, height),
            txt = {
                "font": '10px Fontin-Sans, Arial',
                stroke: "none",
                fill: "#fff"
            },
            color = $("#chart").css("color");
        var plotW = width - leftgutter;
        var plotH = height - bottomgutter;
        var bp2px = Math.ceil(parseInt(json["max1"])/plotW);
        var p2px  = Math.ceil(parseInt(json["max2"])/plotH);
        var xticks = 10; // TODO: configure

        for (var i = 0; i <= 10; i++) {
            axisy.push((1-i/10).toFixed(1));
        }
        for (var i = 0; i <= xticks; i++)
            axisx.push((i * bp2px * plotW / xticks).toFixed(0));
        var X = (width - leftgutter) / axisx.length,
            Y = (height - bottomgutter) / axisy.length;
        max = Math.round(X / 2) - 1;
        var radius = function radius(value) {
            return Math.min(Math.round(Math.sqrt(Math.PI / value)), max);
        };
        // r.rect(0, 0, width, height, 5).attr({fill: "#000", stroke: "none"});
        for (var i = 0, ii = axisx.length; i < ii; i++) {
            r.text(leftgutter + X * (i + .5), height - 8, axisx[i]).attr(txt);
        }
        for (var i = 0, ii = axisy.length; i < ii; i++) {
            r.text(10, Y * (i + .5), axisy[i]).attr(txt);
        }
        var o = 0;
        var data = json['data'];
        jQuery.each(data, function(i, rect) {
            if (i > 100) { return; }
            var center = [
                leftgutter + Math.round((rect[1] - rect[0])/bp2px),
                height - bottomgutter - Math.round((rect[3] - rect[2])/p2px)
            ];
            console.log(rect, center);
            var dot = r.circle(center[0], center[1], radius(rect[4])).attr({
                fill: "hsb(1, 1, 1)",
                stroke: "none"
            });
        });
        for (var i = 0, ii = axisy.length; i < ii; i++) {
            // console.log("i:" + i + " ii:" + ii + " max:" + max);
            for (var j = 0, jj = axisx.length; j < jj; j++) {
                // console.log(Math.min(Math.round(Math.sqrt(Math.PI / Math.PI) * 4)));
                var R = data[o] && Math.min(Math.round(Math.sqrt(data[o] / Math.PI) * 4), max);
                if (R) {
                    (function(dx, dy, R, value) {
                        var color = "hsb(" + [(1 - R / max) * .5, 1, .75] + ")";
                        var dt = r.circle(dx + 60 + R, dy + 10, R).attr({
                            stroke: "none",
                            fill: color
                        });
                        if (R < 6) {
                            var bg = r.circle(dx + 60 + R, dy + 10, 6).attr({
                                stroke: "none",
                                fill: "#000",
                                opacity: .4
                            }).hide();
                        }
                        var lbl = r.text(dx + 60 + R, dy + 10, data[o])
                        .attr({
                            "font": '10px Fontin-Sans, Arial',
                            stroke: "none",
                            fill: "#fff"
                        }).hide();
                        var dot = r.circle(dx + 60 + R, dy + 10, max).attr({
                            stroke: "none",
                            fill: "#000",
                            opacity: 0
                        });
                        dot[0].onmouseover = function() {
                            if (bg) {
                                bg.show();
                            } else {
                                var clr = Raphael.rgb2hsb(color);
                                clr.b = .5;
                                dt.attr("fill", Raphael.hsb2rgb(clr).hex);
                            }
                            lbl.show();
                        };
                        dot[0].onmouseout = function() {
                            if (bg) {
                                bg.hide();
                            } else {
                                dt.attr("fill", color);
                            }
                            lbl.hide();
                        };
                    })(leftgutter + X * (j + .5) - 60 - R, Y * (i + .5) - 10, R, data[o]);
                }
                o++;
            }
        }
    }
});