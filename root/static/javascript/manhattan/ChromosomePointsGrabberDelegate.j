@import <Foundation/CPObject.j>

@implementation ChromosomePointsGrabberDelegate : CPObject {
    CPURL URL @accessors;
    id owner @accessors;
    int experiment @accessors;
    int chromosome @accessors;
    CPString chromosomeLabel @accessors;
    int bins @accessors;
    BOOL refine @accessors;
}

+(CPURL) urlForExperiment:(int) experiment andChromosome:(int) chromosome inBins:(int) bins {

    return [CPString stringWithFormat:"http://brie.cshl.edu/~olson/qdv/web/run.pl?exe=get2DDist&b=%@&d=GWAS/assoc&c1=pos&c2=score&w=id=%@+and+chr=%@",
        bins, //NOTE  - needs extension for variable size bins!
        experiment,
        chromosome
    ];
}

+(id) chromosomePointsGrabberForExperiment:(int) experiment andChromosome:(int) chromosome withLabel:(CPString) label andOwner:(id) owner inBins:(int) bins {
    return [self chromosomePointsGrabberForExperiment:experiment andChromosome:chromosome withLabel:label andOwner:owner inBins:bins refine:[[[CPApplication sharedApplication] delegate] refine]];
}

+(id) chromosomePointsGrabberForExperiment:(int) experiment andChromosome:(int) chromosome withLabel:(CPString) label andOwner:(id) owner inBins:(int) bins refine:(BOOL) refine {

    var url = [self urlForExperiment:experiment andChromosome:chromosome inBins:bins];

    var cpg = [[self alloc] init];
    [cpg setURL:url];
    [cpg setOwner:owner];
    [cpg setExperiment:experiment];
    [cpg setChromosome:chromosome];
    [cpg setChromosomeLabel:label];
    [cpg setBins:bins];
    [cpg setRefine:refine];

	var request = [[CPURLRequest alloc] initWithURL:url];
    var connection = [CPURLConnection connectionWithRequest:request delegate:cpg];
    return cpg;
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {

    var bins = [self bins];
    try {

        var shouldRefine = false;

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

            if (! shouldRefine) {
                var binArea = (json.data[i][1] - json.data[i][0]) * (json.data[i][3] - json.data[i][2]);
                var pixelArea = [[owner view] xThreshold] * [[owner view] yThreshold];

                if (pixelArea / binArea < 0.2) {
                    shouldRefine = true;
                }
            }
        }

        [owner addCoordinates:coordsArray forChromosome:[self chromosome] withLabel:[self chromosomeLabel]];

        if (shouldRefine && [self refine] && [self bins] < 1000) {
            [ChromosomePointsGrabberDelegate chromosomePointsGrabberForExperiment:[self experiment]
                andChromosome:[self chromosome]
                withLabel:[self chromosomeLabel]
                andOwner:[self owner]
                inBins:[self bins] + 25
                refine:YES
            ];

        }
    }
    catch (e) {

        if ([self bins] > 0) {
            [ChromosomePointsGrabberDelegate chromosomePointsGrabberForExperiment:[self experiment]
                andChromosome:[self chromosome]
                withLabel:[self chromosomeLabel]
                andOwner:[self owner]
                inBins:[self bins] - 1
                refine:NO
            ];
        }
    }

}


@end
