import { handleArrows } from './Keyboard'

const Coord = {
  vx: 'vx',
  vy: 'vy'
}
const otherCoord = coord => Object.values(Coord).filter(c => c !== coord)

export default class MovesWithKeyboard {

  constructor(velocity = 5) {
    this.velocity = velocity
    this.vx = 0
    this.vy = 0
    this.stopsOtherMovement = true

    handleArrows(this)
  }
  
  update(c) {
    c.x += this.vx
    c.y += this.vy
  }

  move = (coord, delta) => () => {
    this[coord] = delta * this.velocity
    if (this.stopsOtherMovement) {
      this[otherCoord(coord)] = 0
    }
  }
  stop = (coord, otherDirection) => () => {
    if (!this.keyboard[otherDirection].isDown && (!this.stopsOtherMovement || this[otherCoord(coord)] === 0)) {
      this[coord] = 0
    }
  }

  startMovingLeft = this.move(Coord.vx, -1)
  stopMovingLeft = this.stop(Coord.vx, 'right')

  startMovingRight = this.move(Coord.vx, 1)
  stopMovingRight = this.stop(Coord.vx, 'left')

  startMovingUp = this.move(Coord.vy, -1)
  stopMovingUp = this.stop(Coord.vy, 'down')

  startMovingDown = this.move(Coord.vy, 1)
  stopMovingDown = this.stop(Coord.vy, 'up')

}