function LED16(rect, onColor, offColor, bgColor) {
    
    LED7.prototype.constructor.call(this, rect, onColor, offColor, bgColor);
}

LED16.prototype = new LED7();
LED16.prototype.parent = LED7.prototype;
LED16.prototype.constructor = LED16;

LED16.prototype.initializeSegments = function(rect) {
    this.parent.initializeSegments.call(this, rect);
    this.segments = ['a', 'A', 'b', 'c', 'd', 'D', 'e', 'f', 'g', 'G', 'h', 'j', 'k', 'l', 'm', 'n'];
    
    var ledDiag = rect.size.width / 10;
    var segWidth = rect.size.width - ledDiag * 4;
    
    this.a = 
        new Rectangle(
            new Point(rect.origin.x + ledDiag, rect.origin.y),
            new Size(ledDiag * 2 + segWidth / 2 - ledDiag, ledDiag * 2)
        );
    this.A = 
        new Rectangle(
            new Point(this.a.origin.x + this.a.size.width, rect.origin.y),
            new Size(ledDiag * 2 + segWidth / 2 - ledDiag, ledDiag * 2)
        );
        
    this.d = 
        new Rectangle(
            new Point(rect.origin.x + ledDiag, rect.origin.y + ledDiag * 4 + segWidth * 2),
            new Size(ledDiag * 2 + segWidth / 2 - ledDiag, ledDiag * 2)
        );
    this.D = 
        new Rectangle(
            new Point(this.d.origin.x + this.d.size.width, rect.origin.y + ledDiag * 4 + segWidth * 2),
            new Size(ledDiag * 2 + segWidth / 2 - ledDiag, ledDiag * 2)
        );
        
    this.g = 
        new Rectangle(
            new Point(rect.origin.x + ledDiag, rect.origin.y + ledDiag * 2 + segWidth),
            new Size(ledDiag * 2 + segWidth / 2 - ledDiag, ledDiag * 2)
        );
    this.G = 
        new Rectangle(
            new Point(this.g.origin.x + this.g.size.width, rect.origin.y + ledDiag * 2 + segWidth),
            new Size(ledDiag * 2 + segWidth / 2 - ledDiag, ledDiag * 2)
        );
        
    this.h =
        new Rectangle(
            new Point(rect.origin.x + ledDiag * 2, rect.origin.y + ledDiag * 2),
            new Size(segWidth / 2 - ledDiag, segWidth)
        );
        
    this.j =
        new Rectangle(
            new Point(rect.origin.x + rect.size.width / 2 - ledDiag, rect.origin.y + ledDiag),
            new Size(ledDiag * 2, ledDiag * 2 + segWidth)
        );
        
    this.k =
        new Rectangle(
            new Point(rect.origin.x + ledDiag * 3 + segWidth / 2, rect.origin.y + ledDiag * 2),
            new Size(segWidth / 2 - ledDiag, segWidth)
        );
        
    this.l =
        new Rectangle(
            new Point(rect.origin.x + ledDiag * 3 + segWidth / 2, rect.origin.y + ledDiag * 4 + segWidth),
            new Size(segWidth / 2 - ledDiag, segWidth)
        );
        
    this.m =
        new Rectangle(
            new Point(rect.origin.x + rect.size.width / 2 - ledDiag, rect.origin.y + ledDiag * 3 + segWidth),
            new Size(ledDiag * 2, ledDiag * 2 + segWidth)
        );
        
    this.n =
        new Rectangle(
            new Point(rect.origin.x + ledDiag * 2, rect.origin.y + ledDiag * 4 + segWidth),
            new Size(segWidth / 2 - ledDiag, segWidth)
        );
    
};

LED16.prototype.segmentDrawingFunction = function(segment) {
    if (segment == 'h' || segment == 'l') {
        return 'drawDiagonalSegmentInRect';
    }
    else if (segment == 'k' || segment == 'n') {
        return 'drawFlippedDiagonalSegmentInRect';
    }
    else {
        return this.parent.segmentDrawingFunction.call(this, segment);
    }
}

LED16.prototype.drawFlippedDiagonalSegmentInRect = function(ctx, bounds, color) {
    this.drawDiagonalSegmentInRect(ctx, bounds, color, 1);
}

LED16.prototype.drawDiagonalSegmentInRect = function(ctx, bounds, color, flipped) {

    if (bounds == undefined) {
        return;
    }
    
    if (typeof color == 'object') {
        color = color.asString();
    }

    var ratio = bounds.size.height / bounds.size.width;

    var ledDiag = Math.min(bounds.size.width, bounds.size.height) / 2;

    ctx.save();
    if (flipped) {
        ctx.translate(bounds.origin.x + bounds.size.width,0);
        ctx.scale(-1,1);
        ctx.translate(- bounds.origin.x,0);
    }
    
    ctx.beginPath();
    ctx.moveTo(bounds.origin.x, bounds.origin.y);
    ctx.lineTo(bounds.origin.x + ledDiag, bounds.origin.y);
    ctx.lineTo(bounds.origin.x + bounds.size.width, bounds.origin.y + bounds.size.height - ledDiag * ratio);
    ctx.lineTo(bounds.origin.x + bounds.size.width, bounds.origin.y + bounds.size.height);
    ctx.lineTo(bounds.origin.x + bounds.size.width - ledDiag, bounds.origin.y + bounds.size.height);
    ctx.lineTo(bounds.origin.x, bounds.origin.y + ledDiag * ratio);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();

}

LED16.prototype.characterMap = {
    A : 'aAbcefgG',
    a : 'aAbcdDegG',
    B : 'aAbcdDGjm',
    b : 'defgm',
    C : 'aAdDef',
    c : 'gGdDe',
    D : 'aAbcdDjm',
    d : 'bcDGm',
    E : 'aAdDefgG',
    e : 'aAbdDefgG',
    F : 'aAefgG',
    f : 'AgGjm',
    G : 'aAcdDefG',
    g : 'aAbcdDfgG',
    H : 'bcefgG',
    h : 'efgm',
    I : 'aAjmdD',
    i : 'Am',
    J : 'aAjmde',
    j : 'Adm',
    K : 'efgkl',
    k : 'kljm',
    L : 'dDef',
    l : 'aDjm',
    M : 'bcefhk',
    m : 'cegGm',
    N : 'bcefhl',
    n : 'cegG',
    O : 'aAbcdDef',
    o : 'cdDegG',
    P : 'aAbefgG',
    p : 'AbGjm',
    Q : 'aAbcedDefl',
    q : 'aDfgjm',
    R : 'aAbefgGl',
    r : 'egG',
    S : 'aAcdDfgG',
    s : 'aAcdDfgG',
    T : 'aAjm',
    t : 'DgGjm',
    U : 'bcdDef',
    u : 'cdDe',
    V : 'efkn',
    v : 'en',
    W : 'bcefln',
    w : 'cdDem',
    X : 'hkln',
    x : 'hkln',
    Y : 'hkm',
    y : 'hkn',
    Z : 'aAdDkn',
    z : 'aAdDkn',
    
    0 : 'aAbcdDefkn',
    1 : 'adDjm',
    2 : 'aAbdDGn',
    3 : 'aAbcdDG',
    4 : 'bcfgG',
    5 : 'aAdDfgl',
    6 : 'acdDefgG',
    7 : 'aAbc', 
    8 : 'aAbcdDefgG',
    9 : 'aAbcdDfgG',
    
    '.' : 'd',
    '/' : 'kn',
    ':' : 'AD',
    '!' : 'fd',
    ';' : 'AdD',
    '$' : 'aAcdDfgGjm',
    '*' : 'gGhjklmn',
    ',' : 'n',
    '<' : 'kl',
    '>' : 'hn',
    '?' : 'aAbGm',
    '{' : 'ADgjm',
    '}' : 'adGjm',
};
