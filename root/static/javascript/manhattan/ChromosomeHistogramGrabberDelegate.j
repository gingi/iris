@import <Foundation/CPObject.j>

@implementation ChromosomeHistogramGrabberDelegate : CPObject {
    CPURL URL @accessors;
    id owner @accessors;
    int experiment @accessors;
    int chromosome @accessors;
    CPString chromosomeLabel @accessors;
    int bins @accessors;
    BOOL refine @accessors;
    CPArray prune @accessors;
    CPColor color @accessors;
    int throttle @accessors;
}

-(id) init {
    if (self = [super init]) {
        [self setThrottle:1];
    }
    return self;
}

+(CPURL) urlForExperiment:(int) experiment andChromosome:(int) chromosome inBins:(int) bins withClauses:(CPArray) clauses {

    /*return [CPString stringWithFormat:"http://brie.cshl.edu/~olson/qdv/web/run.pl?exe=get2DDist&b=%@&d=GWAS/%@&c1=pos&c2=score&w=id=%@+and+chr=%@",
        bins, //NOTE  - needs extension for variable size bins!
        [[[CPApplication sharedApplication] delegate] study],
        experiment,
        chromosome
    ];*/

    var clause = "";

    if ([clauses count]) {    
        var i = 0;

        var parsedClauses = [CPArray array];
        for (i = 0; i < [clauses count]; i++) {
            var c = [clauses objectAtIndex:i];

            if ([c length]) {
                [parsedClauses addObject:[CPString stringWithFormat:"w=%@", encodeURI(c)]];
            }
        }
    
        if ([parsedClauses count]) {
            clause = [CPString stringWithFormat:"?%@", [parsedClauses componentsJoinedByString:"&"]];
        }
    }
        
    return [CPString stringWithFormat:"/manhattanproxy/get_coordinates/%@/%@/%@/%@%@",
        bins,
        [[[CPApplication sharedApplication] delegate] study],
        experiment,
        chromosome,
        clause
    ];
}

+(id) coordinateGrabberForExperiment:(int) experiment andChromosome:(int) chromosome withLabel:(CPString) label andOwner:(id) owner inBins:(int) bins {
    return [self coordinateGrabberForExperiment:experiment andChromosome:chromosome withLabel:label andOwner:owner inBins:bins refine:[[[CPApplication sharedApplication] delegate] refine]];
}

+(id) coordinateGrabberForExperiment:(int) experiment andChromosome:(int) chromosome withLabel:(CPString) label andOwner:(id) owner inBins:(int) bins refine:(BOOL) refine {

    var url = [self urlForExperiment:experiment andChromosome:chromosome inBins:bins withClauses:[CPArray arrayWithObject:[[[CPApplication sharedApplication] delegate] clause]]];

    var cpg = [[self alloc] init];
    [cpg setURL:url];
    [cpg setOwner:owner];
    [cpg setExperiment:experiment];
    [cpg setChromosome:chromosome];
    [cpg setChromosomeLabel:label];
    [cpg setBins:bins];
    [cpg setRefine:refine];
    
    var chrRect = [owner rectForChromosome:chromosome];
    var minBinSize = CGSizeMake([[owner view] xThreshold], [[owner view] yThreshold]);
    
    var maxDim = chrRect.size.width > chrRect.size.height
        ? chrRect.size.width
        : chrRect.size.height;
    var minDim = minBinSize.width > minBinSize.height
        ? minBinSize.width
        : minBinSize.height;
        
    var maxBins = maxDim / minDim;
    
    var newThrottle = 1;
    
    while (maxDim / bins > minDim) {
        maxDim = maxDim / bins;
        newThrottle++;
    }
    
    [cpg setThrottle:newThrottle];

	var request = [[CPURLRequest alloc] initWithURL:url];
    var connection = [CPURLConnection connectionWithRequest:request delegate:cpg];
    return cpg;
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {

    var bins = [self bins];
    try {

        var shouldRefine = false;
        var widthScale  = [[owner view] widthScale];
        var heightScale = [[owner view] heightScale];

        var json = [data objectFromJSON];

        var chrRect = [owner rectForChromosome:[self chromosome]];
        var manhattanRect = [[owner view] manhattanRect];
        
        if ([[self prune] count]) {
        
            var i = 0;
            for (i = 0; i < [[self prune] count]; i++) {
                var toPrune = [[self prune] objectAtIndex:i];

                var x1 = [toPrune objectForKey:"x1"];
                var x2 = [toPrune objectForKey:"x2"];
                var y1 = [toPrune objectForKey:"y1"];
                var y2 = [toPrune objectForKey:"y2"];
    
                var redisplayArea = CGRectMake(
                    Math.floor(chrRect.origin.x + x1 * widthScale),
                    Math.floor(chrRect.origin.y + manhattanRect.size.height - (y2 - y1) * heightScale - (y1 - [owner yMin]) * heightScale),
                    Math.ceil((x2 - x1) * widthScale),
                    Math.ceil((y2 - y1) * heightScale)
                );
    
                [[[owner chromosome:[self chromosome]] objectForKey:"coords"] removeObject:toPrune];
                
                [[owner view] setNeedsDisplayInRect:redisplayArea];
            }
        }
        else {
            [[owner chromosome:[self chromosome]] setObject:[CPArray array] forKey:"coords"];
        }
        
        var coordsArray = [[owner chromosome:[self chromosome]] objectForKey:"coords"];
        
        var i;

        var newCoordsArray = [CPArray array];

        var refinerDelegate = [[[self class] alloc] init];
        [refinerDelegate setOwner:[self owner]];
        [refinerDelegate setExperiment:[self experiment]];
        [refinerDelegate setChromosome:[self chromosome]];
        [refinerDelegate setChromosomeLabel:[self chromosomeLabel]];
        [refinerDelegate setBins:[self bins]];
        [refinerDelegate setRefine:[self refine]];
        if ([[[CPApplication sharedApplication] delegate] debugDraw]) {
            [refinerDelegate setColor:[CPColor redColor]];
        }
        [refinerDelegate setThrottle:[self throttle] - 1];

        var refinerClauses = [CPArray array];
        var refinerPrune = [CPArray array];

        for (i = 0; i < json.data.length; i++) {
        
            var newCoord =  [CPDictionary dictionaryWithObjectsAndKeys:
                    json.data[i][0], "x1",
                    json.data[i][1], "x2",
                    json.data[i][2], "y1",
                    json.data[i][3], "y2",
                    json.data[i][4], "count",
                    json.data[i][5], "density"
                ];
            if ([self color]) {
                [newCoord setObject:[self color] forKey:"color"];
            }
        
            [coordsArray addObject:newCoord];

            var x1 = [newCoord objectForKey:"x1"];
            var x2 = [newCoord objectForKey:"x2"];
            var y1 = [newCoord objectForKey:"y1"];
            var y2 = [newCoord objectForKey:"y2"];

            var coordRect = CGRectMake(
                Math.floor(chrRect.origin.x + x1 * widthScale),
                Math.floor(chrRect.origin.y + manhattanRect.size.height - (y2 - y1) * heightScale - (y1 - [owner yMin]) * heightScale),
                Math.ceil((x2 - x1) * widthScale),
                Math.ceil((y2 - y1) * heightScale)
            );
            [[owner view] setNeedsDisplayInRect:coordRect];

            var scaledWidth = (json.data[i][1] - json.data[i][0]) * widthScale;
            var scaledHeight = (json.data[i][3] - json.data[i][2]) * heightScale;
            var binArea = scaledWidth * scaledHeight;
            var pixelArea = [[owner view] xThreshold] * [[owner view] yThreshold] * json.data[i][4];    //width * height * count
//                pixelArea = json.data[i][4];

            var pixelDensity = pixelArea / binArea;

            if (pixelDensity < 0.99 && [self throttle]) {
                [newCoord setObject:true forKey:"prune"];
                shouldRefine = true;

                [refinerPrune addObject:newCoord];
                [refinerClauses addObject:[CPString stringWithFormat:"pos >= %@ and pos <= %@ and score >= %@ and score <= %@",
                                                    [newCoord objectForKey:"x1"],
                                                    [newCoord objectForKey:"x2"],
                                                    [newCoord objectForKey:"y1"],
                                                    [newCoord objectForKey:"y2"]
                                                ]
                ];
                
            }

        }
        
        if ([refinerClauses count] && [self refine]) {
        
            [refinerDelegate setPrune:refinerPrune];
            [refinerDelegate setURL:
                [[self class] urlForExperiment:[refinerDelegate experiment]
                                 andChromosome:[refinerDelegate chromosome]
                                        inBins:[refinerDelegate bins]
                                    withClauses:nil
                ]
            ];
            
            var refinerContent = "";
           {
                var i = 0;
                var wClauses = [CPArray array];
                for (i = 0; i < [refinerClauses count]; i++) {
                    var clause = [refinerClauses objectAtIndex:i];
                    [wClauses addObject:[CPString stringWithFormat:"w=%@", clause]];
                }
                refinerContent = [wClauses componentsJoinedByString:"&"];
            }
           var request = [[CPURLRequest alloc] initWithURL:[refinerDelegate URL]];
           [request setHTTPMethod:@"POST"];
           [request setHTTPBody:refinerContent];
           [request setValue:"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
           
           var connection = [CPURLConnection connectionWithRequest:request delegate:refinerDelegate];
        }
        
        // I'm gonna keep this sitting in here...for now. This is the start of the code to attempt to combine rectangles into
        // larger ones. I need to think about the algorithm a bit more.
/*        [newCoordsArray sortUsingDescriptors:
            [CPArray arrayWithObjects:
                [[CPSortDescriptor alloc] initWithKey:"x1" ascending:YES],
                [[CPSortDescriptor alloc] initWithKey:"y1" ascending:YES]
            ]
        ];
        
        {
            var squareArray = [CPArray array];
            var lastX1 = nil;
            var lineArray = nil;
            var newCoordsArrayEnumerator = [newCoordsArray objectEnumerator];
            var coords = nil;
            while (coords = [newCoordsArrayEnumerator nextObject]) {
                if ([[coords objectForKey:"x1"] isEqual:lastX1]) {
                    [lineArray addObject:coords];
                }
                else {
                    lineArray = [CPArray array];
                    [squareArray addObject:lineArray];
                    [lineArray addObject:coords];
                    lastX1 = [coords objectForKey:"x1"];
                }   
            }
            console.log("SQUARE : " + [squareArray count] + ' and ' + [[squareArray objectAtIndex:2] count]);
            for (j = 0; j < [squareArray count]; j++) {
                console.log("SEES : " + [squareArray objectAtIndex:j]);
            }
        }
*/
    }
    catch (e) {

        console.log("INVALID JSON ON HISTOGRAM GRABBER : " + e);

    }

}


@end
