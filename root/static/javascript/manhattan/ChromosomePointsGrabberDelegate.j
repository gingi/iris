@import <Foundation/CPObject.j>

@implementation ChromosomePointsGrabberDelegate : CPObject {
    CPURL URL @accessors;
    id owner @accessors;
    int experiment @accessors;
    int chromosome @accessors;
    CPString chromosomeLabel @accessors;
}

+(CPURL) urlForExperiment:(int) experiment andChromosome:(int) chromosome  {

    /*return [CPString stringWithFormat:"http://brie.cshl.edu/~olson/qdv/web/run.pl?exe=fbsql&d=GWAS/%s&s=chr,pos,score&w=id=%s+and+chr=%s",
        [[[CPApplication sharedApplication] delegate] study],
        experiment,
        chromosome
    ];*/

    return [CPString stringWithFormat:"/manhattanproxy/get_all_points/%@/%@/%@",
        [[[CPApplication sharedApplication] delegate] study],
        experiment,
        chromosome
    ];
}

+(id) coordinateGrabberForExperiment:(int) experiment andChromosome:(int) chromosome withLabel:(CPString) label andOwner:(id) owner inBins:(int) bins {


    var url = [self urlForExperiment:experiment andChromosome:chromosome];

    var cpg = [[self alloc] init];
    [cpg setURL:url];
    [cpg setOwner:owner];
    [cpg setExperiment:experiment];
    [cpg setChromosome:chromosome];
    [cpg setChromosomeLabel:label];

	var request = [[CPURLRequest alloc] initWithURL:url];
    var connection = [CPURLConnection connectionWithRequest:request delegate:cpg];
    return cpg;
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {

    try {

        var widthScale  = [[owner view] widthScale];
        var heightScale = [[owner view] heightScale];
        
        var xThreshold  = [[owner view] xThreshold];
        var yThreshold  = [[owner view] yThreshold];

        var json = [data objectFromJSON];

        var coordsArray = [CPArray array];

        var i;

        for (i = 0; i < json.length; i++) {
        
            var x1 = json[i][1] - (xThreshold - 1) / 2 / widthScale;
            var y1 = json[i][2] - (yThreshold - 1) / 2 / heightScale;
            
            var x2 = x1 + (xThreshold - 1) / 2 / widthScale;
            var y2 = y1 + (yThreshold - 1) / 2 / heightScale;
        
            [coordsArray addObject:
                [CPDictionary dictionaryWithObjectsAndKeys:
                    x1, "x1",
                    x2, "x2",
                    y1, "y1",
                    y2, "y2",
                    1, "count",
                    1, "density"
                ]
            ];

        }
        [owner addCoordinates:coordsArray forChromosome:[self chromosome] withLabel:[self chromosomeLabel]];

    }
    catch (e) {
        console.log("WTF : " + e);
    }

}

@end