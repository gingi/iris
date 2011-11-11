@import <Foundation/CPObject.j>

@implementation ChromosomeHistogramGrabberDelegate : CPObject {
    CPURL URL @accessors;
    id owner @accessors;
    int experiment @accessors;
    int chromosome @accessors;
    CPString chromosomeLabel @accessors;
    int bins @accessors;
    BOOL refine @accessors;
}

+(CPURL) urlForExperiment:(int) experiment andChromosome:(int) chromosome inBins:(int) bins {

    /*return [CPString stringWithFormat:"http://brie.cshl.edu/~olson/qdv/web/run.pl?exe=get2DDist&b=%@&d=GWAS/%@&c1=pos&c2=score&w=id=%@+and+chr=%@",
        bins, //NOTE  - needs extension for variable size bins!
        [[[CPApplication sharedApplication] delegate] study],
        experiment,
        chromosome
    ];*/

    return [CPString stringWithFormat:"/manhattanproxy/get_coordinates/%@/%@/%@/%@",
        bins, //NOTE  - needs extension for variable size bins!
        [[[CPApplication sharedApplication] delegate] study],
        experiment,
        chromosome
    ];
}

+(id) coordinateGrabberForExperiment:(int) experiment andChromosome:(int) chromosome withLabel:(CPString) label andOwner:(id) owner inBins:(int) bins {
    return [self coordinateGrabberForExperiment:experiment andChromosome:chromosome withLabel:label andOwner:owner inBins:bins refine:[[[CPApplication sharedApplication] delegate] refine]];
}

+(id) coordinateGrabberForExperiment:(int) experiment andChromosome:(int) chromosome withLabel:(CPString) label andOwner:(id) owner inBins:(int) bins refine:(BOOL) refine {

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
        var widthScale  = [[owner view] widthScale];
        var heightScale = [[owner view] heightScale];

        var json = [data objectFromJSON];

        var coordsArray = [[owner chromosome:[self chromosome]] objectForKey:"coords"];
        var coordsArrayEnumerator = [[CPArray arrayWithArray:coordsArray] objectEnumerator];
        var c = nil;

        while (c = [coordsArrayEnumerator nextObject]) {
            if ([c objectForKey:"prune"] == true) {
                [coordsArray removeObject:c];
            }
        }

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

            if (1 || ! shouldRefine) {
                var scaledWidth = (json.data[i][1] - json.data[i][0]) * widthScale;
                var scaledHeight = (json.data[i][3] - json.data[i][2]) * heightScale;
                var binArea = scaledWidth * scaledHeight;
                var pixelArea = /* [[owner view] xThreshold] * [[owner view] yThreshold] * */ json.data[i][4];    //width * height * count


                if (pixelArea / binArea < 0.90) {
                    [[coordsArray lastObject] setObject:true forKey:"prune"];
                    shouldRefine = true;
                    console.log("SPARSE : " + [self chromosome] + " density is: " + (pixelArea / binArea) + " for " + json.data[i][4]);
                    console.log(
                        json.data[i][0] + ' -> ' + json.data[i][1]
                        + ' , ' +
                        json.data[i][2] + ' -> ' + json.data[i][3]
                    );
                }
                else {
                    console.log("DENSE  : " + [self chromosome] + " density is: " + (pixelArea / binArea) + " for " + json.data[i][4]);
                }
            }

        }
console.log("REDRAW COORDS INSIDE " + CPStringFromRect([owner rectForChromosome:[self chromosome]]));
console.log([owner view]);
        [[owner view] setNeedsDisplayInRect:[owner rectForChromosome:[self chromosome]]];


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

}


@end
