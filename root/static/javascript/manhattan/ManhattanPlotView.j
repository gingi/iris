@import <AppKit/CPView.j>
@import "ManhattanDataObject.j"

@implementation ManhattanPlotView : CPView {
    ManhattanDataObject dataSource @accessors;

    int yTicks @accessors;
}

-(CPTextField) label:(CPString) label inArea:(CGSize) area {

    var field = [[CPTextField alloc] initWithFrame:CGRectMake(0,0,0,0)];
    [field setObjectValue:label];
    var fontSize = 10;
    var fontName = "Arial"
    var font = [CPFont fontWithName:fontName size:fontSize];
    [field setFont:font];
    [field sizeToFit];

    while ([field bounds].size.width > area.width
        && [field bounds].size.height > area.height
        && fontSize >= 2) {
        fontSize--;

        var font = [CPFont fontWithName:fontName size:fontSize];
        [field setFont:font];
        [field sizeToFit];

    }

    return field;
}

-(void) drawRect:(CGRect) rect {

    var context = [[CPGraphicsContext currentContext] graphicsPort];

    if (CGRectEqualToRect(rect, [self bounds])) {
        CGContextSetFillColor(context, [CPColor darkGrayColor]);
        CGContextFillRect(context, rect);
    }

    var subViewEnumerator = [[self subviews] objectEnumerator];
    var sv = nil;
    while (sv = [subViewEnumerator nextObject]) {
        if (CGRectIntersectsRect([sv frame], rect)) {
            [sv removeFromSuperview];
        }
    }

    var chromosomeEnumerator = [[dataSource chromosomes] objectEnumerator];
    var chr = nil;

    var viewWidth = [self bounds].size.width;
    var viewHeight = [self bounds].size.height;

    var widthScale  = viewWidth  / ([[self dataSource] xMax] - [[self dataSource] xMin]);
    var heightScale = viewHeight / ([[self dataSource] yMax] - [[self dataSource] yMin]);

    var yMin = [[self dataSource] yMin];

    while (chr = [chromosomeEnumerator nextObject]) {

        if ([chr isEqual:[CPNull null]]) {
            continue;
        }

        var chrRect = [dataSource rectForChromosome:[chr objectForKey:"number"]];

        if (! CGRectIntersectsRect(chrRect, rect)) {
            continue;
        }

        CGContextSetFillColor(context, [CPColor whiteColor]);
        CGContextFillRect(context, chrRect);

        var coordsEnumerator = [[chr objectForKey:"coords"] objectEnumerator];
        var coords = nil;

        while (coords = [coordsEnumerator nextObject]) {

            var x1 = [coords objectForKey:"x1"];
            var x2 = [coords objectForKey:"x2"];
            var y1 = [coords objectForKey:"y1"];
            var y2 = [coords objectForKey:"y2"];
            var count = [coords objectForKey:"count"];

            var coordRect = CGRectMake(
                x1 * widthScale + chrRect.origin.x,
                viewHeight - (y2 - y1) * heightScale - (y1 - yMin) * heightScale,
                (x2 - x1) * widthScale,
                (y2 - y1) * heightScale
            );

            var density = count * 81 / (coordRect.size.width * coordRect.size.height);


            var color = [[self dataSource] colorAtIndex:[chr objectForKey:"number"] - 1];
            var alphaColor = [CPColor colorWithCalibratedRed:[color redComponent]
                                                    green:[color greenComponent]
                                                    blue:[color blueComponent]
                                                    alpha:density];

            CGContextSetFillColor(context, alphaColor);
            CGContextSetStrokeColor(context, alphaColor);
            CGContextFillRect(context, coordRect);
            CGContextStrokeRect(context, coordRect);

        }

        var label = [self label:[chr objectForKey:"name"] inArea:chrRect.size];
        [self addSubview:label];
        [label setFrameOrigin:
            CGPointMake(
                chrRect.origin.x + chrRect.size.width / 2 - [label frame].size.width / 2,
                viewHeight - [label bounds].size.height - 5
            )
        ];

        CGContextSetStrokeColor(context, [CPColor blackColor]);
        CGContextStrokeRect(context, chrRect);
    }
    [self drawScaleInRect:rect];

}

-(void) drawScaleInRect:(CGRect) rect {

    if ([[dataSource yMin] compare:[dataSource yMax]] != CPOrderedAscending) {
        return;
    }

    var indent = 0;

    var viewBounds = [self bounds];
    var viewWidth = viewBounds.size.width;
    var viewHeight = viewBounds.size.height;

    var labelTop = [self label:[CPString stringWithFormat:"%.2f", [dataSource yMax]] inArea:viewBounds.size];
    [labelTop setFrameOrigin:CGPointMake(indent, indent)];
    if (CGRectIntersectsRect([labelTop frame], rect)) {
        [self addSubview:labelTop];
    }

    var labelBottom = [self label:[CPString stringWithFormat:"%.2f", [dataSource yMin]] inArea:viewBounds.size];
    [labelBottom setFrameOrigin:CGPointMake(indent, viewHeight - [labelBottom bounds].size.height - indent)];
    if (CGRectIntersectsRect([labelBottom frame], rect)) {
        [self addSubview:labelBottom];
    }

    var yScale = viewHeight / ([self yTicks] + 1);

    var i;

    [[CPColor blackColor] set];
    for (i = 1; i <= [self yTicks] ; i++) {
        var i_scaled = i * yScale;
        var labelValue = [CPString stringWithFormat:"%.2f", [dataSource yMin] + i * ([dataSource yMax] - [dataSource yMin]) / ([self yTicks] + 1)];
        var label = [self label:labelValue inArea:viewBounds.size];
        [label setFrameOrigin:CGPointMake(indent, viewHeight - [label bounds].size.height / 2 - i_scaled)];
        if (CGRectIntersectsRect([label frame], rect)) {
            [self addSubview:label];
        }

        var markerPath = [CPBezierPath bezierPath];

        var startX = indent + [label frame].size.width + indent + viewBounds.origin.x;
        if (startX < rect.origin.x) {
            startX = rect.origin.x;
        }
        else if (startX > rect.origin.x + rect.size.width) {
            startX = rect.origin.x + rect.size.width;
        }

        var endX = viewWidth + viewBounds.origin.x;
        if (endX < rect.origin.x) {
            endX = rect.origin.x;
        }
        else if (endX > rect.origin.x + rect.size.width) {
            endX = rect.origin.x + rect.size.width;
        }

        [markerPath moveToPoint:
            CGPointMake(
                startX,
                viewHeight - i_scaled + viewBounds.origin.y
            )
        ];
        [markerPath lineToPoint:
            CGPointMake(
                endX,
                viewHeight - i_scaled + viewBounds.origin.y
            )
        ];

        [markerPath closePath];
        [markerPath setLineWidth:0.2];
        [markerPath stroke];

    }

}

@end
