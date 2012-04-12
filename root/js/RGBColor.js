function RGBColor(r,g,b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

RGBColor.prototype.asString = function () {
    return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
}
