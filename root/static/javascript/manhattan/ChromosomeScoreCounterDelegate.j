@import <Foundation/CPObject.j>

@import "ChromosomePointsGrabberDelegate.j"

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
    var json = [data objectFromJSON];

    var i = 0;
    var minScore = 10000000000;
    var maxScore = 0;
    for (i = 0; i < json.length; i++) {
        if (json[i][1] < minScore) {
            minScore = json[i][1];
        }
        if (json[i][2] > maxScore) {
            maxScore = json[i][2];
        }


        [ChromosomePointsGrabberDelegate chromosomePointsGrabberForExperiment:[self experiment]
            andChromosome:json[i][0]
            withLabel:json[i][0]
            andOwner:[self owner]
            inBins:[[[CPApplication sharedApplication] delegate] initialBins]
        ];

    }

    [owner setYMin:[[[CPApplication sharedApplication] delegate] pinZero] ? 0 : minScore];
    [owner setYMax:maxScore];
    
    [[owner view] recalculateManhattanRect];
    [[owner view] setNeedsDisplay:YES];

}

@end
