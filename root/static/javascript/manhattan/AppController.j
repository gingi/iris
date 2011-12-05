/*
 * AppController.j
 * manhattan
 *
 * Created by You on November 2, 2011.
 * Copyright 2011, Your Company All rights reserved.
 */

@import <Foundation/CPObject.j>
@import "ManhattanPlotView.j"
@Import "ManhattanDataObject.j"

@import "ChromosomeGrabberDelegate.j"

@implementation AppController : CPObject
{
    CPWindow    theWindow; //this "outlet" is connected automatically by the Cib
    ManhattanPlotView view;
    bool refine @accessors;
    bool pinZero @accessors;
    bool study @accessors;
    int initialBins @accessors;
    CPString renderer @accessors;
    CPString clause @accessors;
    bool debugDraw @accessors;
}

- (void)applicationDidFinishLaunching:(CPNotification)aNotification
{
    // This is called when the application is done loading.
	[CPMenu setMenuBarVisible:NO];
	
	var appArgs = [CPDictionary dictionaryWithObjectsAndKeys:
	    true, "refine",
	    false, "pinZero",
	    false, "debugDraw",
	    "assoc", "study",
	    [CPNull null], "initialBins",
	    "histogram", "renderer",
	    "", "clause"
	];
	
	var appArgsEnumerator = [appArgs keyEnumerator];
	var arg = nil;
	
	while (arg = [appArgsEnumerator nextObject]) {
	    var val = [appArgs objectForKey:arg];
        var passedVal = [[[CPApplication sharedApplication] namedArguments] objectForKey:arg];
        if (passedVal != nil) {
            if ([arg isEqual:"refine"] || [arg isEqual:"pinZero"] || [arg isEqual:"debugDraw"]) {
                passedVal = passedVal == 1 ? true : false;
            }
            val = passedVal;
        }
        [self setValue:val forKey:arg];
    }

    var mdo = [[ManhattanDataObject alloc] init];
    [mdo setView:view];
    [ChromosomeGrabberDelegate chromosomeGrabberForExperiment:[[[CPApplication sharedApplication] namedArguments] objectForKey:"id"] andOwner:mdo];

    [view setYTicks:2];
    [view setThreshold:3];
    [view setDataSource:mdo];
    [view setNeedsDisplay:YES];


}

- (void)awakeFromCib
{
    // This is called when the cib is done loading.
    // You can implement this method on any object instantiated from a Cib.
    // It's a useful hook for setting up current UI values, and other things.

    // In this case, we want the window from Cib to become our full browser window
    [theWindow setFullPlatformWindow:YES];


}

@end
