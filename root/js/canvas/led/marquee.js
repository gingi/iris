function Marquee(o) {
    
    var ratio = 1.8;
    var ledSpacing = 1;
    
    this.characters = o.characters;
    this.onColor = o.onColor;
    this.offColor = o.offColor;
    this.bgColor = o.bgColor;
    this.animate = o.animate;
    this.led = o.led;
    if (this.led == undefined) {
        this.led = LED7;
    }
    this.speed = o.speed;
    if (this.speed == undefined) {
        this.speed = 200;
    }

    this.bounds = o.bounds;

    if (this.bounds == undefined) {

        if (! o.characters) {
            throw("Must specify characters if no bounds provided");
        }

        if (! o.height) {
            throw("No height specified!");
        }
        
        var ledWidth = o.height / ratio;
        var marqueeWidth = ledWidth * o.characters + (o.characters - 1) * ledSpacing;
        
        
        this.bounds = new Rectangle(
            o.origin,
            new Size(marqueeWidth, o.height)
        );
        this.ledOrigin = o.origin;
        
    }
    else {
        var ledWidth = this.bounds.size.height / ratio;

        var characters = Math.floor(this.bounds.size.width / ledWidth);

        var spacingSize = this.bounds.size.width - characters * ledWidth;

        if (spacingSize - (characters - 1) * ledSpacing < 0 ) {
            characters--;
        }
        this.characters = characters;

        
        var totalLedWidth = this.characters * ledWidth + (this.characters -1 ) * ledSpacing;
        var gutterWidth = (this.bounds.size.width - totalLedWidth) / 2;
        
        this.ledOrigin = new Point(
            this.bounds.origin.x + gutterWidth,
            this.bounds.origin.y
        );

    }

    var ledWidth = this.bounds.size.height / ratio;
    this.ledSize = new Size(ledWidth, this.bounds.size.height);   
    
    this.string = o.string;

    this.leds = new Array();
    for (var i = 0; i < this.characters; i++) {

        this.leds.push(
            new this.led(
                new Rectangle(
                    new Point(
                        this.ledOrigin.x + i * ledWidth + i * ledSpacing,
                        this.ledOrigin.y
                    ),
                    this.ledSize
                ),
                this.onColor,
                this.offColor,
                this.bgColor
            )
        );
                
    }
    
}

Marquee.prototype.setString = function (newString) {
    this.string = newString;
    this.paddedString = undefined;
}

Marquee.prototype.draw = function(ctx) {

    if (this.animate) {
        if (! this.paddedString) {
            var padding = new Array(this.characters + 1).join(' ');
            this.paddedString = padding + this.string;// + padding;
        }
    }
    else {
        this.paddedString = this.string;
    }

    var bgColor = typeof this.bgColor == 'object'
        ? this.bgColor.asString()
        : this.bgColor;

    ctx.fillStyle = bgColor;
    ctx.fillRect(this.bounds.origin.x, this.bounds.origin.y, this.bounds.size.width, this.bounds.size.height);

    var chars = this.paddedString.split('');

    for (var i = 0; i < chars.length; i++) {
        if (i < this.leds.length) {
            this.leds[i].setCharacter(chars[i]);
            this.leds[i].draw(ctx);
        }
    }
    
    if (this.animate) {
        var first = this.paddedString.charAt(0);
        this.paddedString = this.paddedString.substr(1) + first;
        var me = this;
        setTimeout(function() {me.draw(ctx) }, this.speed);
    }
    
}