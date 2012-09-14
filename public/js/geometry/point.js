function Point(x,y) {
    this.x = x;
    this.y = y;
}

Point.prototype.asString = function () {
    return "{" + this.x + ", " + this.y + "}";
}

Point.prototype.offset = function(dx, dy) {
    return new Point(this.x + dx, this.y + dy);
}