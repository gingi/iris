@import <Foundation/CPObject.j>

@import "ChromosomePointsGrabberDelegate.j"
@import "ChromosomeHistogramGrabberDelegate.j"
@import "ChromosomeScatterGrabberDelegate.j"

@implementation ChromosomeScoreCounterDelegate : CPObject {
    CPURL URL @accessors;
    id owner @accessors;
    int experiment @accessors;
}

+(CPURL) urlForExperiment:(int) experiment {

    /*return [CPString stringWithFormat:"http://brie.cshl.edu/~olson/qdv/web/run.pl?exe=fbsql&d=GWAS/%@&s=chr,min(score),max(score)&w=id=%@",
        [[[CPApplication sharedApplication] delegate] study],
        experiment
    ];*/

    return [CPString stringWithFormat:"/manhattanproxy/get_scores/%@/%@",
        [[[CPApplication sharedApplication] delegate] study],
        experiment
    ];
}

+(id) chromosomeScoreCounterForExperiment:(int) experiment andOwner:(id) owner {

    var url = [self urlForExperiment:experiment];

    var csc = [[self alloc] init];
    [csc setURL:url];
    [csc setOwner:owner];
    [csc setExperiment:experiment];

	var request = [[CPURLRequest alloc] initWithURL:url];
    var connection = [CPURLConnection connectionWithRequest:request delegate:csc];
    return csc;
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    try {
        var json = [data objectFromJSON];

        var i = 0;
        var minScore = 10000000000;
        var maxScore = 0;
        for (i = 0; i < json.length ; i++) {
            if (json[i][1] < minScore) {
                minScore = json[i][1];
            }
            if (json[i][2] > maxScore) {
                maxScore = json[i][2];
            }

            var rendererDictionary = [CPDictionary dictionaryWithObjectsAndKeys:
                [ChromosomePointsGrabberDelegate class],    @"points",
                [ChromosomeHistogramGrabberDelegate class], @"histogram",
                [ChromosomeScatterGrabberDelegate class],   @"scatter"
            ];
    
            var pixelArea = [[owner view] xThreshold] * [[owner view] yThreshold] * json[i][3];    //width * height * count
            var chrRect = [owner rectForChromosome:json[i][0]];
            var chrArea = chrRect.size.width * chrRect.size.height;
            
            var density = pixelArea / chrArea;
            
            var bins = [[[CPApplication sharedApplication] delegate] initialBins];
            
            //maybe dynamically figure out a good starting point?
            if (bins == [CPNull null]) {
                //bins = density < 0.5 ? 5 : 25;
                bins = 25;
            }
    
            [[rendererDictionary objectForKey:[[[CPApplication sharedApplication] delegate] renderer]] coordinateGrabberForExperiment:[self experiment]
                andChromosome:json[i][0]
                withLabel:json[i][0]
                andOwner:[self owner]
                inBins:bins
            ];
    
        }
    
        [owner setYMin:[[[CPApplication sharedApplication] delegate] pinZero] ? 0 : minScore];
        [owner setYMax:maxScore];

        [[owner view] recalculateManhattanRect];
        [[owner view] setNeedsDisplay:YES];
    }
    catch (e) {
        console.log("INVALID JSON ON SCORE GRABBER : " + e);
    }
}

@end
