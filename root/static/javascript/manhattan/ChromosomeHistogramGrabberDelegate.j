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
    console.log("WITH CLAUSES : ", clauses);    
    
        if ([parsedClauses count]) {
            clause = [CPString stringWithFormat:"?%@", [parsedClauses componentsJoinedByString:"&"]];
        }
    }
    
    console.log("NEW CLAUSE : " + clause);
    
    return [CPString stringWithFormat:"/manhattanproxy/get_coordinates/%@/%@/%@/%@%@",
        bins, //NOTE  - needs extension for variable size bins!
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
console.log("CLAUSE IS : " + [[[CPApplication sharedApplication] delegate] clause]);
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
console.log("THROTTLE AT : " + newThrottle);
//exit;

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

        /*var coordsArray = [[owner chromosome:[self chromosome]] objectForKey:"coords"];
        var coordsArrayEnumerator = [[CPArray arrayWithArray:coordsArray] objectEnumerator];
        var c = nil;

        while (c = [coordsArrayEnumerator nextObject]) {
            if (1 || [c objectForKey:"prune"] == true) {
                [coordsArray removeObject:c];
            }
        }*/
        

        var chrRect = [owner rectForChromosome:[self chromosome]];
        var manhattanRect = [[owner view] manhattanRect];
        
console.log("SHOULD PRUNE ? " + [self prune]);        
        if ([[self prune] count]) {
        
            var i = 0;
            for (i = 0; i < [[self prune] count]; i++) {
                var toPrune = [[self prune] objectAtIndex:i];

                var x1 = [toPrune objectForKey:"x1"];
                var x2 = [toPrune objectForKey:"x2"];
                var y1 = [toPrune objectForKey:"y1"];
                var y2 = [toPrune objectForKey:"y2"];
    
                var redisplayArea = CGRectMake(
                    Math.floor(chrRect.origin.x + x1 * widthScale) - 5,
                    Math.floor(chrRect.origin.y + manhattanRect.size.height - (y2 - y1) * heightScale - (y1 - [owner yMin]) * heightScale) - 5,
                    Math.ceil((x2 - x1) * widthScale) + 10,
                    Math.ceil((y2 - y1) * heightScale) + 10
                );
    
                [[[owner chromosome:[self chromosome]] objectForKey:"coords"] removeObject:toPrune];
                
                [[owner view] setNeedsDisplayInRect:redisplayArea];
                console.log("PRUNES : " + CPStringFromRect(redisplayArea));
            }
        }
        else {
            [[owner chromosome:[self chromosome]] setObject:[CPArray array] forKey:"coords"];
        }
        
        var coordsArray = [[owner chromosome:[self chromosome]] objectForKey:"coords"];
        
        var i;

        var newCoordsArray = [CPArray array];

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
            console.log("REDISPLAY IN " + CPStringFromRect(coordRect));

            if (1 || ! shouldRefine) {
                var scaledWidth = (json.data[i][1] - json.data[i][0]) * widthScale;
                var scaledHeight = (json.data[i][3] - json.data[i][2]) * heightScale;
                var binArea = scaledWidth * scaledHeight;
                var pixelArea = [[owner view] xThreshold] * [[owner view] yThreshold] * json.data[i][4];    //width * height * count
//                pixelArea = json.data[i][4];

                var pixelDensity = pixelArea / binArea;
//                pixelDensity = pixelDensity - Math.floor(pixelDensity);
console.log("IN WITH THROTTLE : " + [self throttle]);
                if (pixelDensity < 0.80 && [self throttle]) {
console.log("THROTTLED : " + [self throttle]);
                    [newCoord setObject:true forKey:"prune"];
                    shouldRefine = true;
                    console.log("SPARSE : " + [self chromosome] + " density is: " + (pixelArea / binArea) + " for " + json.data[i][4] + ' of ' + pixelArea + ' inside: ' + binArea);
                    console.log(
                        json.data[i][0] + ' -> ' + json.data[i][1]
                        + ' , ' +
                        json.data[i][2] + ' -> ' + json.data[i][3]
                    );
                    
                    var refinerDelegate = [[[self class] alloc] init];
                    [refinerDelegate setOwner:[self owner]];
                    [refinerDelegate setExperiment:[self experiment]];
                    [refinerDelegate setChromosome:[self chromosome]];
                    [refinerDelegate setChromosomeLabel:[self chromosomeLabel]];
                    [refinerDelegate setBins:[self bins]];
                    [refinerDelegate setRefine:[self refine]];
//                    [refinerDelegate setColor:[CPColor redColor]];
                    [refinerDelegate setPrune:[CPArray arrayWithObject:newCoord]];
                    [refinerDelegate setThrottle:[self throttle] - 1];

                    [refinerDelegate setURL:
                        [[self class] urlForExperiment:[refinerDelegate experiment]
                                         andChromosome:[refinerDelegate chromosome]
                                                inBins:[refinerDelegate bins]
                                            withClauses:
                                                [CPArray arrayWithObject:
                                                    [CPString stringWithFormat:"pos >= %@ and pos <= %@ and score >= %@ and score <= %@",
                                                        [newCoord objectForKey:"x1"],
                                                        [newCoord objectForKey:"x2"],
                                                        [newCoord objectForKey:"y1"],
                                                        [newCoord objectForKey:"y2"]
                                                    ]
                                                ]
                        ]
                    ];
                   var request = [[CPURLRequest alloc] initWithURL:[refinerDelegate URL]];
                   var connection = [CPURLConnection connectionWithRequest:request delegate:refinerDelegate];
console.log("REFINE WITH URL : " + [refinerDelegate URL]);                    
                }
                else {
                    console.log("DENSE  : " + [self chromosome] + " density is: " + (pixelArea / binArea) + " for " + json.data[i][4] + ' of ' + pixelArea + ' inside: ' + binArea);
                }
            }

        }
        
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
        
        
        
        
//        [coordsArray addObjectsFromArray:newCoordsArray];
        
console.log("REDRAW COORDS INSIDE " + CPStringFromRect([owner rectForChromosome:[self chromosome]]));
//        [[owner view] setNeedsDisplayInRect:[owner rectForChromosome:[self chromosome]]];


        if (shouldRefine && [self refine] && [self bins] < 1000) {
            [ChromosomeHistogramGrabberDelegate coordinateGrabberForExperiment:[self experiment]
                andChromosome:[self chromosome]
                withLabel:[self chromosomeLabel]
                andOwner:[self owner]
                inBins:[self bins] + 25
                refine:YES
            ];

        }
    }
    catch (e) {

        console.log("INVALID JSON ON HISTOGRAM GRABBER : " + e);

        if ([self bins] > 0) {
            [ChromosomeHistogramGrabberDelegate coordinateGrabberForExperiment:[self experiment]
                andChromosome:[self chromosome]
                withLabel:[self chromosomeLabel]
                andOwner:[self owner]
                inBins:[self bins] - 1
                refine:NO
            ];
        }
    }
    
    console.log("ALL DATA LOADED");
    //[[owner view] setNeedsDisplayInRect:[[owner view] bounds]];

}


@end
