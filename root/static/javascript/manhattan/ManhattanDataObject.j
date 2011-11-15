@import <Foundation/CPObject.j>

@implementation ManhattanDataObject : CPObject {

    int xMin @accessors;
    int xMax @accessors;

    int yMin @accessors;
    int yMax @accessors;

    CPDictionary chromosomes @accessors;
    CPArray colorArray @accessors;

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
        
        [self setChromosomes:[CPDictionary dictionary]];
    }
    return self;
}

-(CPDictionary) chromosome:(id) chr {
    var chromosome = [[self chromosomes] objectForKey:chr];

    if (chromosome == nil) {
        chromosome = [CPMutableDictionary dictionaryWithObjectsAndKeys:
            chr, "number",
            chr, "name",
            [CPArray array], "coords"
        ];
        [[self chromosomes] setObject:chromosome forKey:chr];
    }

    return chromosome;
}

-(CPArray) sortedChromosomeKeys {
    return [[[self chromosomes] allKeys] sortedArrayUsingSelector:@selector(compare:)];
}

-(CPColor) colorAtIndex:(int) idx {
    return [[self colorArray] objectAtIndex:idx % [[self colorArray] count]];
}

-(CGRect) rectForChromosome:(int) chromosome {

    var chrRect = [[self view] manhattanRect];

    var chrWidth = [[self chromosome:chromosome] objectForKey:"length"] / ([self xMax] - [self xMin]) * chrRect.size.width;
    var i = 0;
    
    var chrNumEnumerator = [[self sortedChromosomeKeys] objectEnumerator];
    var chrNum = nil;

    while (chrNum = [chrNumEnumerator nextObject]) {

        var chr = [self chromosome:chrNum];
        if (chrNum >= chromosome) {
            continue;
        }

        chrRect.origin.x += [[self chromosome:chrNum] objectForKey:"length"] / ([self xMax] - [self xMin]) * chrRect.size.width;
    }    

    chrRect.size.width = chrWidth;
    
    chrRect.origin.x = Math.floor(chrRect.origin.x);
    chrRect.origin.y = Math.floor(chrRect.origin.y);
    
    chrRect.size.width = Math.ceil(chrRect.size.width);
    chrRect.size.height = Math.ceil(chrRect.size.height);
    
    console.log("RECT IS : " + CPStringFromRect(chrRect));
    return chrRect;
}

@end
