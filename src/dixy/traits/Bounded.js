

export default class Bounded {
  constructor(boundingBox) {
    this.boundingBox = boundingBox
  }
  
  update(c) {
    c.x = this.bound(c.x, this.boundingBox.x1, this.boundingBox.x2 - c.width)
    c.y = this.bound(c.y, this.boundingBox.y1, this.boundingBox.y2 - c.height)
  }

  bound(coord, min, max) {
    return Math.min(Math.max(coord, min), max)
  }
}