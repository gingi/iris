@import <AppKit/CPView.j>
@import "ManhattanDataObject.j"

@implementation ManhattanPlotView : CPView {
    ManhattanDataObject dataSource @accessors;

    int yTicks @accessors;

    int xThreshold @accessors;
    int yThreshold @accessors;
    
    CGRect internalManhattanRect @accessors;
    int scaleWidth @accessors;
}

-(id) initWithFrame:(CGRect) frame {
    if (self = [super initWithFrame:frame]) {
        [self setInternalManhattanRect:[self bounds]];
    }
    
    return self;
}

-(void) setThreshold:(int) threshold {
    [self setXThreshold:threshold];
    [self setYThreshold:threshold];
}

-(CPTextField) label:(CPString) label inArea:(CGSize) area {

    var field = [[CPTextField alloc] initWithFrame:CGRectMake(0,0,0,0)];
    [field setObjectValue:label];
    var fontSize = 10;
    var fontName = "Arial"
    var font = [CPFont fontWithName:fontName size:fontSize];
    [field setFont:font];
    [field sizeToFit];

    //if you don't want dynamic sizing, so everything is always 10 point arial, return here.
    //if you want to dynamically resize to try and fit the area, comment out this return statement
    //to drop into the while loop and return later.
    return field;

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

// kinda squirrely.  In cappuccino, CGRects are full first class objects, unlike cocoa. Returns a copy (at least for now), so I can
// directly edit the rect. I'd like to revisit this.
-(CGRect) manhattanRect {

    return CGRectMake(
        internalManhattanRect.origin.x,
        internalManhattanRect.origin.y,
        internalManhattanRect.size.width,
        internalManhattanRect.size.height
    );
    
}

-(float) widthScale {
    return [self manhattanRect].size.width  / ([[self dataSource] xMax] - [[self dataSource] xMin]);
}

-(float) heightScale {
    return [self manhattanRect].size.height / ([[self dataSource] yMax] - [[self dataSource] yMin]);
}

-(void) drawRect:(CGRect) rect {

    var context = [[CPGraphicsContext currentContext] graphicsPort];

    var subViewEnumerator = [[self subviews] objectEnumerator];
    var sv = nil;
    while (sv = [subViewEnumerator nextObject]) {
        if (CGRectIntersectsRect([sv frame], rect)) {
            [sv removeFromSuperview];
        }
    }

    if (CGRectEqualToRect(rect, [self bounds])) {
        [self recalculateManhattanRect];
        CGContextSetFillColor(context, [CPColor whiteColor]);
        CGContextFillRect(context, rect);
        
        [self drawLabelsInRect:[self bounds]];
        [self drawScaleInRect:[self bounds]];
    }

    var chromosomeEnumerator = [[dataSource chromosomes] objectEnumerator];
    var chr = nil;

    var manhattanRect = [self manhattanRect];

    var widthScale  = [self widthScale];
    var heightScale = [self heightScale];

    var yMin = [[self dataSource] yMin];

    while (chr = [chromosomeEnumerator nextObject]) {

        if ([chr isEqual:[CPNull null]]) {
            continue;
        }

        var chrRect = [dataSource rectForChromosome:[chr objectForKey:"number"]];

        if (! CGRectIntersectsRect(chrRect, rect)) {
            continue;
        }

        var chrColor = [CPColor whiteColor];

        if ([chr objectForKey:"coords"] == nil || [[chr objectForKey:"coords"] count] == 0) {
            chrColor = [CPColor darkGrayColor];
        }

        CGContextSetFillColor(context, chrColor);
        CGContextFillRect(context, chrRect);
        CGContextSetStrokeColor(context, chrColor);
        CGContextStrokeRect(context, chrRect);

        [self drawScaleLinesInRect:chrRect];

        var coordsEnumerator = [[chr objectForKey:"coords"] objectEnumerator];
        var coords = nil;

        while (coords = [coordsEnumerator nextObject]) {

            var x1 = [coords objectForKey:"x1"];
            var x2 = [coords objectForKey:"x2"];
            var y1 = [coords objectForKey:"y1"];
            var y2 = [coords objectForKey:"y2"];
            var count = [coords objectForKey:"count"];

            var coordRect = CGRectMake(
                chrRect.origin.x + x1 * widthScale,
                chrRect.origin.y + manhattanRect.size.height - (y2 - y1) * heightScale - (y1 - yMin) * heightScale,
                (x2 - x1) * widthScale,
                (y2 - y1) * heightScale
            );

            if (coordRect.size.width < [self xThreshold]) {
                coordRect.size.width = [self xThreshold];
            }

            if (coordRect.size.height < [self yThreshold]) {
                coordRect.size.height = [self yThreshold];
            }

            coordRect = CGRectIntersection(coordRect, manhattanRect);

            var density = count * [self xThreshold] * [self yThreshold] / (coordRect.size.width * coordRect.size.height);


            var color = [[self dataSource] colorAtIndex:[chr objectForKey:"number"] - 1];
            var alphaColor = [CPColor colorWithCalibratedRed:[color redComponent]
                                                    green:[color greenComponent]
                                                    blue:[color blueComponent]
                                                    alpha:density];
            CGContextSetLineWidth(context, 1.0);
            CGContextSetFillColor(context, alphaColor);
            CGContextSetStrokeColor(context, alphaColor);
            CGContextFillRect(context, coordRect);
            CGContextStrokeRect(context, coordRect);

        }
        
        CGContextBeginPath(context);
        CGContextMoveToPoint(context, chrRect.origin.x, chrRect.origin.y);
        CGContextAddLineToPoint(context, chrRect.origin.x + chrRect.size.width, chrRect.origin.y);
        CGContextMoveToPoint(context, chrRect.origin.x, chrRect.origin.y + chrRect.size.height);
        CGContextAddLineToPoint(context, chrRect.origin.x + chrRect.size.width, chrRect.origin.y + chrRect.size.height);
        
        //first chromosome? Draw the left vertical line
        if (chrRect.origin.x <= manhattanRect.origin.x) {
            CGContextMoveToPoint(context, manhattanRect.origin.x, manhattanRect.origin.y);
            CGContextAddLineToPoint(context, manhattanRect.origin.x, manhattanRect.origin.y + manhattanRect.size.height);
        }

        //last chromosome? Draw the right vertical line
        if (chrRect.origin.x + chrRect.size.width >= manhattanRect.origin.x + manhattanRect.size.width) {
            CGContextMoveToPoint(context, manhattanRect.origin.x + manhattanRect.size.width, manhattanRect.origin.y);
            CGContextAddLineToPoint(context, manhattanRect.origin.x + manhattanRect.size.width, manhattanRect.origin.y + manhattanRect.size.height);
        }
        
        CGContextClosePath(context); 
        CGContextSetStrokeColor(context, [CPColor blackColor]);
        CGContextSetLineWidth(context, 0.2);
        CGContextStrokePath(context);
        
    }

}

-(void) recalculateManhattanRect {

    var chromosomeEnumerator = [[dataSource chromosomes] objectEnumerator];
    var chr = nil;

    var yOffset = 0;
    var yPadding = 5;
    
    var newManhattanRect = [self bounds];;

    while (chr = [chromosomeEnumerator nextObject]) {
        if ([chr isEqual:[CPNull null]]) {
            continue;
        }
        
        var chrRect = [dataSource rectForChromosome:[chr objectForKey:"number"]];
        
        var label = [self label:[chr objectForKey:"name"] inArea:chrRect.size];

        if ([label frame].size.height + yPadding > yOffset) {
            yOffset = [label frame].size.height + yPadding;
        }

    }
    
    if (yOffset > 0) {
        newManhattanRect.size.height = [self bounds].size.height - yOffset;
    }
    
    if ([[dataSource yMin] compare:[dataSource yMax]] == CPOrderedAscending) {

        var xOffset = 0;
        var xPadding = 0;

        var yScale = ([dataSource yMax] - [dataSource yMin]) / ([self yTicks] + 1);

        var i = 0;
        for (i = [dataSource yMin]; i <= [dataSource yMax]; i += yScale) {

            var labelValue = [CPString stringWithFormat:"%.2f", i];
            var label = [self label:labelValue inArea:newManhattanRect.size];
            
            if ([label frame].size.width + xPadding > xOffset) {
                xOffset = [label frame].size.width + xPadding;
            }
            
            if ([label frame].size.width > scaleWidth) {
                [self setScaleWidth:[label frame].size.width];
            }
        }
        
        if (xOffset > 0) {        
            newManhattanRect.origin.x   = [self bounds].origin.x   + xOffset;
            newManhattanRect.size.width = [self bounds].size.width - xOffset;
        }

    }


    [self setInternalManhattanRect:newManhattanRect];    

}

-(void) drawLabelsInRect:(CGRect) rect {

    var chromosomeEnumerator = [[dataSource chromosomes] objectEnumerator];
    var chr = nil;
    
    var context = [[CPGraphicsContext currentContext] graphicsPort];
    var drawFirst = true;
    
    while (chr = [chromosomeEnumerator nextObject]) {
        if ([chr isEqual:[CPNull null]]) {
            continue;
        }

        var chrRect = [dataSource rectForChromosome:[chr objectForKey:"number"]];
        var viewRect = [self bounds];
        
        var label = [self label:[chr objectForKey:"name"] inArea:chrRect.size];
        [self addSubview:label];

        [label setFrameOrigin:
            CGPointMake(
                chrRect.origin.x + chrRect.size.width / 2 - [label frame].size.width / 2,
                chrRect.origin.y + viewRect.size.height - [label bounds].size.height - 5
            )
        ];
        
        var labelFrame = [label frame];
        
        CGContextBeginPath(context);
        if (drawFirst) {
            CGContextMoveToPoint(context, chrRect.origin.x, labelFrame.origin.y);
            CGContextAddLineToPoint(context, chrRect.origin.x, labelFrame.origin.y + labelFrame.size.height / 2);
            drawFirst = false;
        }
        
        CGContextMoveToPoint(context, chrRect.origin.x + chrRect.size.width, labelFrame.origin.y);
        CGContextAddLineToPoint(context, chrRect.origin.x + chrRect.size.width, labelFrame.origin.y + labelFrame.size.height / 2);
        
        CGContextClosePath(context); 
        CGContextSetStrokeColor(context, [CPColor blackColor]);
        CGContextSetLineWidth(context, .2);
        CGContextStrokePath(context);

    }
}

-(void) drawScaleInRect:(CGRect) rect {

    if ([[dataSource yMin] compare:[dataSource yMax]] != CPOrderedAscending) {
        return;
    }
    
    var indent = 0;

    var viewBounds = [self manhattanRect];
    var viewWidth = viewBounds.size.width;
    var viewHeight = viewBounds.size.height;

    var labelTop = [self label:[CPString stringWithFormat:"%.2f", [dataSource yMax]] inArea:viewBounds.size];
    [labelTop setFrameOrigin:CGPointMake(indent, indent)];
    [labelTop setFrameSize:CGSizeMake([self scaleWidth], [labelTop frame].size.height)]; 
    [labelTop setAlignment:CPRightTextAlignment];
    if (CGRectIntersectsRect([labelTop frame], rect)) {
        [self addSubview:labelTop];
    }

    var labelBottom = [self label:[CPString stringWithFormat:"%.2f", [dataSource yMin]] inArea:viewBounds.size];
    [labelBottom setFrameOrigin:CGPointMake(indent, viewHeight - [labelBottom bounds].size.height - indent)];
    [labelBottom setFrameSize:CGSizeMake([self scaleWidth], [labelBottom frame].size.height)]; 
    [labelBottom setAlignment:CPRightTextAlignment];

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
        [label setFrameSize:CGSizeMake([self scaleWidth], [label frame].size.height)]; 
        [label setAlignment:CPRightTextAlignment];
        if (CGRectIntersectsRect([label frame], rect)) {
            [self addSubview:label];
        }
        
    }
    
    [self drawScaleLinesInRect:rect];

}

-(void) drawScaleLinesInRect:(CGRect) rect {

    if ([[dataSource yMin] compare:[dataSource yMax]] != CPOrderedAscending) {
        return;
    }
    
    var indent = 0;

    var viewBounds = [self manhattanRect];
    var viewWidth = viewBounds.size.width;
    var viewHeight = viewBounds.size.height;

    var yScale = viewHeight / ([self yTicks] + 1);

    var i;

    var context = [[CPGraphicsContext currentContext] graphicsPort];
    for (i = 1; i <= [self yTicks] ; i++) {
        var i_scaled = i * yScale;
        var markerPath = [CPBezierPath bezierPath];

        var startX = viewBounds.origin.x;
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
    
        CGContextBeginPath(context);
        CGContextMoveToPoint(context, startX, viewHeight - i_scaled + viewBounds.origin.y);
        CGContextAddLineToPoint(context, endX, viewHeight - i_scaled + viewBounds.origin.y);
        CGContextClosePath(context); 
        CGContextSetStrokeColor(context, [CPColor lightGrayColor]);
        CGContextSetLineWidth(context, 0.2);
        CGContextStrokePath(context);

    }

}

@end
