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
        console.log("plot[]", plotW, plotH);
        var bp2px = Math.ceil(parseFloat(json["max1"])/plotW);
        var p2px  = parseFloat(json["max2"])/plotH;
        console.log("2px", bp2px, p2px);
        var xticks = 10; // TODO: configure
        var yticks = 10;

        // for (var i = yticks; i >= 0; i--)
        //     axisy.push((i * p2px * plotH / yticks).toFixed(1));
        for (var i = 0; i <= yticks; i++)
            axisy.push((i * plotH / yticks).toFixed(0));
        for (var i = 0; i <= xticks; i++)
            axisx.push((i * bp2px * plotW / xticks).toFixed(0));
        var X = (width - leftgutter) / (axisx.length - 1),
            Y = (height - bottomgutter) / (axisy.length - 1);
        max = 100; //Math.round(X / 2) - 1;
        r.rect(leftgutter, 0, plotW, plotH).attr({
            stroke: "#fff"
        });
        var radius = function radius(value) {
            return Math.min(Math.round(Math.sqrt(value)), max);
        };
        var toX = function(lo, hi) {
            if (hi == null) hi = lo;
            return leftgutter + Math.round((lo + hi)/(2*bp2px));
        };
        var toY = function(lo, hi) {
            if (hi == null) hi = lo;
            return height - bottomgutter - Math.round((lo + hi)/(2*p2px));
        };
        var toH = function(h) { return Math.round(h/bp2px); }
        var toW = function(w) { return Math.round(w/p2px); }
        for (var i = 0, ii = axisx.length; i < ii; i++) {
            r.text(leftgutter + X * (i + 0), height - 8, axisx[i]).attr(txt);
        }
        for (var i = 0, ii = axisy.length; i < ii; i++) {
            r.text(10, Y * (i + 0), axisy[i]).attr(txt);
        }
        var o = 0;
        var data = json['data'];
        jQuery.each(data, function(i, rect) {
            // if (rect[4] > 5 || i > 10000) { return; }
            var center = [
                toX(rect[0], rect[1]),
                toY(rect[2], rect[3])
            ];
            var R = radius(rect[4]);
            var color = "rgba(255, 0, 0, 0.7)";// + Math.min(rect[4]/100 + 0.5, 1) + ")";
            var dt = r.circle(center[0], center[1], R).attr({
                stroke: "none",
                fill: color
            });
            // var dot = r.rect(toX(rect[0]),         toY(rect[3]),
            //                  toH(rect[1]-rect[0]), toW(rect[3]-rect[2])
            //                  ).attr({
            //                      fill: "rgba(0, 128, 0, " + Math.min(rect[4]/100 + 0.5, 1) + ")",
            //                      stroke: "none"
            //                  });
            var dot = r.circle(center[0], center[1], R)
            .attr({
                fill: color,
                stroke: "none"
            });
            if (R < 6) {
                var bg = r.circle(center[0], center[1], 6).attr({
                    stroke: "none",
                    fill: "#666",
                    opacity: .7
                }).hide();
            }
            var lbl = r.text(center[0], center[1], rect[4] + " points")
            .attr({
                "font": '10px Fontin-Sans, Arial',
                stroke: "none",
                fill: "#fff"
            }).hide();
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
        });
        for (var i = 0, ii = axisy.length; i < ii; i++) {
            for (var j = 0, jj = axisx.length; j < jj; j++) {
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