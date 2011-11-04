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
}

- (void)applicationDidFinishLaunching:(CPNotification)aNotification
{
    // This is called when the application is done loading.
	[CPMenu setMenuBarVisible:NO];
	[self setRefine:true];
    var refineArg = [[[CPApplication sharedApplication] namedArguments] objectForKey:"refine"];
    if (refineArg != nil) {
        [self setRefine:refineArg==1 ? true : false];
    }

    [self setPinZero:false];
    pinZeroArg = [[[CPApplication sharedApplication] namedArguments] objectForKey:"pinZero"];
    if (pinZeroArg != nil) {
        [self setPinZero:pinZeroArg==1 ? true : false];
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
