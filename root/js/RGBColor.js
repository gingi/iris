function RGBColor(r,g,b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

RGBColor.prototype.asString = function () {
    return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
}

RGBColor.prototype.invert = function() {
    return new RGBColor(255 - this.r, 255 - this.g, 255 - this.b);
}
