function LED7(rect, onColor, offColor, bgColor) {


    this.onColor = onColor;
    this.offColor = offColor;
    this.bgColor = bgColor;
    
    if (rect != undefined) {
        this.initializeSegments(rect);
    }
}

LED7.prototype.initializeSegments = function(rect) {
                    
    this.bounds = rect;
    
    var ledDiag = rect.size.width / 10;
    var segWidth = rect.size.width - ledDiag * 4;
    
    this.segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
                    
    this.a = 
        new Rectangle(
            new Point(rect.origin.x + ledDiag, rect.origin.y),
            new Size(ledDiag * 2 + segWidth, ledDiag * 2)
        );
    this.b =
        new Rectangle(
            new Point(rect.origin.x + ledDiag * 2 + segWidth, rect.origin.y + ledDiag),
            new Size(ledDiag * 2, ledDiag * 2 + segWidth)
        );
    this.c =
        new Rectangle(
            new Point(rect.origin.x + ledDiag * 2 + segWidth, rect.origin.y + ledDiag * 3 + segWidth),
            new Size(ledDiag * 2, ledDiag * 2 + segWidth)
        );
    this.d = 
        new Rectangle(
            new Point(rect.origin.x + ledDiag, rect.origin.y + ledDiag * 4 + segWidth * 2),
            new Size(ledDiag * 2 + segWidth, ledDiag * 2)
        );

    this.e =
        new Rectangle(
            new Point(rect.origin.x, rect.origin.y + ledDiag * 3 + segWidth),
            new Size(ledDiag * 2, ledDiag * 2 + segWidth)
        );
    this.f =
        new Rectangle(
            new Point(rect.origin.x, rect.origin.y + ledDiag),
            new Size(ledDiag * 2, ledDiag * 2 + segWidth)
        );


    this.g = 
        new Rectangle(
            new Point(rect.origin.x + ledDiag, rect.origin.y + ledDiag * 2 + segWidth),
            new Size(ledDiag * 2 + segWidth, ledDiag * 2)
        );
}

LED7.prototype.setCharacter = function(chr) {
    this.character = this.characterMap[chr]
        ? this.characterMap[chr]
        : this.characterMap[chr.toLowerCase()];
}

LED7.prototype.characterMap = {
    a : 'abcefg',
    b : 'cdefg',
    c : 'adef',
    d : 'bcdeg',
    e : 'adefg',
    f : 'aefg',
    g : 'abcdfg',
    h : 'bcefg',
    i : 'bc',
    j : 'bcde',
    k : 'acefg',
    l : 'def',
    m : 'aceg',
    n : 'ceg',
    o : 'abcdef',
    p : 'abefg',
    q : 'abcfg',
    r : 'eg',
    s : 'acdfg',
    t : 'defg',
    u : 'cde',
    v : 'bdf',
    w : 'bdfg',
    x : 'adg',
    y : 'bcdfg',
    z : 'abdeg',
    
    0 : 'abcdef',
    1 : 'bc',
    2 : 'abdeg',
    3 : 'abcdg',
    4 : 'bcfg',
    5 : 'acdfg',
    6 : 'acdefg',
    7 : 'abc', 
    8 : 'abcdefg',
    9 : 'abcdfg',
};

LED7.prototype.segmentDrawingFunction = function(segment) {
    return 'drawSegmentInRect';
}
        
LED7.prototype.draw = function(ctx) {

    if (this.bounds == undefined) {
        return;
    }

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(this.bounds.origin.x, this.bounds.origin.y, this.bounds.size.width, this.bounds.size.height);

    for (var i = 0; i < this.segments.length; i++) {
    
        var segment = this.segments[i];
        var color = this.offColor;
        if (this.character != undefined && this.character.match(segment)) {
            color = this.onColor;
        }
    
        var func = this.segmentDrawingFunction(segment);
    
        this[func](ctx, this[segment], color);
    }

}

LED7.prototype.drawSegmentInRect = function(ctx, bounds, color) {

    if (bounds == undefined) {
        return;
    }

    if (typeof color == 'object') {
        color = color.asString();
    }

    var ledDiag = Math.min(bounds.size.width, bounds.size.height) / 2;
    var segWidth = Math.max(bounds.size.width, bounds.size.height) - ledDiag * 2;

    ctx.save();
    
    if (bounds.size.height> bounds.size.width) {
        ctx.translate(bounds.origin.x, bounds.origin.y);
        ctx.rotate(Math.PI * 90 / 180);
        ctx.translate(-bounds.origin.x, -bounds.origin.y);
        ctx.translate(0,-ledDiag * 2);
    }

    ctx.beginPath();
    ctx.moveTo(bounds.origin.x, bounds.origin.y + ledDiag);
    ctx.lineTo(bounds.origin.x + ledDiag, bounds.origin.y);
    ctx.lineTo(bounds.origin.x + ledDiag + segWidth, bounds.origin.y);
    ctx.lineTo(bounds.origin.x + ledDiag * 2 + segWidth, bounds.origin.y + ledDiag);
    ctx.lineTo(bounds.origin.x + ledDiag + segWidth, bounds.origin.y + ledDiag * 2);
    ctx.lineTo(bounds.origin.x + ledDiag, bounds.origin.y + ledDiag * 2);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();

}