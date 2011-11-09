@import <Foundation/CPObject.j>
@import "ChromosomeScoreCounterDelegate.j"

@implementation ChromosomeGrabberDelegate : CPObject {
    CPURL URL @accessors;
    id owner @accessors;
    int experiment @accessors;
}

+(CPURL) urlForExperiment:(int) experiment {

    //return "http://brie.cshl.edu/~olson/qdv/web/chr_list.pl?g=at";
    return "/manhattanproxy/get_chromosomes";
}

+(id) chromosomeGrabberForExperiment:(int) experiment andOwner:(id) owner {

    var url = [self urlForExperiment:experiment];

    var cgd = [[self alloc] init];
    [cgd setURL:url];
    [cgd setOwner:owner];
    [cgd setExperiment:experiment];

	var request = [[CPURLRequest alloc] initWithURL:url];
    var connection = [CPURLConnection connectionWithRequest:request delegate:cgd];
    return cgd;
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    var json = [data objectFromJSON];

    var chromosomeLengthMap = [CPDictionary dictionary];

    var i = 0;
    var totalLength = 0;
    for (i = 0; i < json.length; i++) {
        totalLength += json[i][1];
        [chromosomeLengthMap setObject:json[i][1] forKey:json[i][0]];
    }

    [owner setXMin:0];
    [owner setXMax:totalLength];

    [owner setChromosomeLengthMap:chromosomeLengthMap];
    
    [ChromosomeScoreCounterDelegate chromosomeScoreCounterForExperiment:[self experiment] andOwner:[self owner]];
}


@end
