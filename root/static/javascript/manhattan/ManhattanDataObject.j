@import <Foundation/CPObject.j>

@implementation ManhattanDataObject : CPObject {

    int xMin @accessors;
    int xMax @accessors;

    int yMin @accessors;
    int yMax @accessors;

    CPArray chromosomes @accessors;
    CPArray colorArray @accessors;
    CPDictionary chromosomeLengthMap @accessors;

    CPURL URL @accessors;

    CPView view @accessors;
}

-(id) init {
    if (self = [super init]) {
        [self setColorArray:
            [CPArray arrayWithObjects:
                [CPColor blackColor],
                [CPColor orangeColor]
            ]
        ];
        [self setYMin:0];
        [self setYMax:0];
    }
    return self;
}

+(id) manhattanDataObjectObjectWithURL:(CPString) url {

    var mdo = [[self alloc] init];
    [mdo setURL:url];
	var request = [[CPURLRequest alloc] initWithURL:url];
    var connection = [CPURLConnection connectionWithRequest:request delegate:mdo];
    return mdo;
}

-(void) setChromosomeLengthMap:(CPDictionary) newChromosomeLengthMap {
    chromosomeLengthMap = newChromosomeLengthMap;
    
    var chrEnumerator = [chromosomeLengthMap keyEnumerator];
    var chr = nil;
    
    var newChromosomes = [CPMutableArray array];
    
    while (chr = [chrEnumerator nextObject]) {
        [newChromosomes addObject:
            [CPMutableDictionary dictionaryWithObjectsAndKeys:
                chr, "number",
                chr, "name"
            ]
        ];

    }
    
    [self setChromosomes:newChromosomes];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    var json = [data objectFromJSON];
    [self setupFromJSON:json];
}


-(CPColor) colorAtIndex:(int) idx {
    return [[self colorArray] objectAtIndex:idx % [[self colorArray] count]];
}

-(id) initWithJSON:(JSObject) json {
    if (self = [super init]) {
        [self setupFromJSON:json];
    }

    return self;
}

-(void) setupFromJSON:(JSObject) json {
    [self setC:json.c];
    [self setMin:json.min];
    [self setMax:json.max];
    [self setCoordsFromArray:json.data];

}

-(void) addCoordinates:(CPArray) coordinates forChromosome:(int) chromosome withLabel:(CPString) label {

    var chrDic = [CPDictionary dictionaryWithObjectsAndKeys:
        chromosome,     "number",
        label,          "name",
        coordinates,    "coords"
    ];

    [[self chromosomes] replaceObjectAtIndex:chromosome - 1 withObject:chrDic];
    [view setNeedsDisplayInRect:[self rectForChromosome:chromosome]];
}

-(CGRect) rectForChromosome:(int) chromosome {

    var chrRect = [[self view] manhattanRect];

    var chrWidth = [[self chromosomeLengthMap] objectForKey:chromosome] / ([self xMax] - [self xMin]) * chrRect.size.width;
    var i = 0;
    for (i = 1; i < chromosome; i++) {
        chrRect.origin.x += [[self chromosomeLengthMap] objectForKey:i] / ([self xMax] - [self xMin]) * chrRect.size.width;
    }

    chrRect.size.width = chrWidth;

    return chrRect;
}

@end
