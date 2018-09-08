class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  // return the angle of the vector in radians
  getDirection() {
    return Math.atan2(this.y, this.x);
  }

  // set the direction of the vector in radians
  setDirection(angle) {
    const magnitude = this.getMagnitude() || 1;
    this.x = Math.cos(angle) * magnitude;
    this.y = Math.sin(angle) * magnitude;
  };

  getMagnitude() {
    // use pythagoras theorem to work out the magnitude of the vector
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  setMagnitude(magnitude) {
    const direction = this.getDirection();
    this.x = Math.cos(direction) * magnitude;
    this.y = Math.sin(direction) * magnitude;
  };

  // add two vectors together and return a new one
  add(v2) {
    return new Vector(this.x + v2.x, this.y + v2.y);
  };

  // add a vector to this one
 addTo(v2) {
    this.x += v2.x;
    this.y += v2.y;
  };

  // subtract two vectors and reutn a new one
  subtract(v2) {
    return new Vector(this.x - v2.x, this.y - v2.y);
  };

  // subtract a vector from this one
  subtractFrom(v2) {
    this.x -= v2.x;
    this.y -= v2.y;
  };

  // multiply this vector by a scalar and return a new one
  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  };

  // multiply this vector by the scalar
  multiplyBy(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  };

  // scale this vector by scalar and return a new vector
  divide(scalar) {
    return new Vector(this.x / scalar, this.y / scalar);
  };

  // scale this vector by scalar
  divideBy(scalar) {
    this.x /= scalar;
    this.y /= scalar;
  };

  // Aliases
  getLength = this.getMagnitude;
  setLength = this.setMagnitude;
  getAngle = this.getDirection;
  setAngle = this.setDirection;

  copy() {
    return new Vector(this.x, this.y);
  };

  toString() {
    return 'x: ' + this.x + ', y: ' + this.y;
  };

  toArray() {
    return [this.x, this.y];
  };

  toObject() {
    return {x: this.x, y: this.y};
  };

  // static methods
  static distance(x1, y1, x2, y2) {
    const a = x1 - x2;
    const b = y1 - y2;

    return Math.sqrt(a*a + b*b);
  }
}

export default Vector;