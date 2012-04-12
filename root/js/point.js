function Point(x,y) {
    this.x = x;
    this.y = y;
}

Point.prototype.asString = function () {
    return "{" + this.x + ", " + this.y + "}";
}
