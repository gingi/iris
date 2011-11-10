@import <Foundation/CPObject.j>

@implementation ChromosomeScatterGrabberDelegate : CPObject {
    CPURL URL @accessors;
    id owner @accessors;
    int experiment @accessors;
    int chromosome @accessors;
    CPString chromosomeLabel @accessors;
    int resolution @accessors;
    BOOL refine @accessors;
}

+(CPURL) urlForExperiment:(int) experiment andChromosome:(int) chromosome atResolution:(int) res withOwner:(id) owner {

    /*return [CPString stringWithFormat:"http://brie.cshl.edu/~olson/qdv/web/run.pl?exe=scatter&b1=%@&b2=%@&d=GWAS/%@&w=id=%@+and+chr=%@&c1=pos&c2=score",
        bins, //NOTE  - needs extension for variable size bins!
        bins, //NOTE  - needs extension for variable size bins!
        [[[CPApplication sharedApplication] delegate] study],
        experiment,
        chromosome
    ];*/

    var chrRect = [owner rectForChromosome:chromosome];
    //chrRect = [[owner view] bounds];

    if (res > 50) { 
        res = 50;
    }
    if (res < 2) {
        res = 2;
    }

    return [CPString stringWithFormat:"/manhattanproxy/get_scatter/%@/%@/%@/%@/%@/%@",
        Math.floor(chrRect.size.width), //NOTE  - needs extension for variable size bins!
        Math.floor(chrRect.size.height),
        res,
        [[[CPApplication sharedApplication] delegate] study],
        experiment,
        chromosome
    ];
}

+(id) coordinateGrabberForExperiment:(int) experiment andChromosome:(int) chromosome withLabel:(CPString) label andOwner:(id) owner inBins:(int) bins {
    return [self coordinateGrabberForExperiment:experiment andChromosome:chromosome withLabel:label andOwner:owner atResolution:2 refine:[[[CPApplication sharedApplication] delegate] refine]];
}

+(id) coordinateGrabberForExperiment:(int) experiment andChromosome:(int) chromosome withLabel:(CPString) label andOwner:(id) owner atResolution:(int) resolution refine:(BOOL) refine {

    var url = [self urlForExperiment:experiment andChromosome:chromosome atResolution:resolution withOwner:owner];

    var cpg = [[self alloc] init];
    [cpg setURL:url];
    [cpg setOwner:owner];
    [cpg setExperiment:experiment];
    [cpg setChromosome:chromosome];
    [cpg setChromosomeLabel:label];
    [cpg setResolution:resolution];
    [cpg setRefine:refine];

	var request = [[CPURLRequest alloc] initWithURL:url];
    var connection = [CPURLConnection connectionWithRequest:request delegate:cpg];
    return cpg;
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {

    try {

        var widthScale  = [[owner view] widthScale];
        var heightScale = [[owner view] heightScale];

        var json = [data objectFromJSON];

        var coordsArray = [CPArray array];

        var i;

        for (i = 0; i < json.data.length; i++) {
            [coordsArray addObject:
                [CPDictionary dictionaryWithObjectsAndKeys:
                    json.data[i][0], "x1",
                    json.data[i][1], "x2",
                    json.data[i][2], "y1",
                    json.data[i][3], "y2",
                    json.data[i][4], "count",
                    json.data[i][5], "density"
                ]
            ];

        }

        [owner addCoordinates:coordsArray forChromosome:[self chromosome] withLabel:[self chromosomeLabel]];

    }
    catch (e) {
        console.log("INVALID JSON ON SCATTER GRABBER : " + e);
    }
    
    
    if ([self resolution] < 10) {
        [ChromosomeScatterGrabberDelegate coordinateGrabberForExperiment:[self experiment]
            andChromosome:[self chromosome]
            withLabel:[self chromosomeLabel]
            andOwner:[self owner]
            atResolution:[self resolution] + 2
            refine:YES
        ];

    }

}


@end
