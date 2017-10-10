import { keyboard } from '../../utils'

export default class MovesWithKeyboardInAllDirections {

  constructor() {
    this.vx = 0
    this.vy = 0
    const left = keyboard(37)
    const up = keyboard(38)
    const right = keyboard(39)
    const down = keyboard(40)
    const self = this

    Object.assign(left, {
      press() {
        self.vx = -5
        // self.vy = 0
      },
      release() {
        if (!right.isDown) {
          self.vx = 0
        }
      }
    })
    
    Object.assign(up, {
      press() {
        // self.vx = 0
        self.vy = -5
      },
      release() {
        if (!down.isDown) {
          self.vy = 0;
        }
      }
    })

    Object.assign(right, {
      press() {
        self.vx = 5
        // self.vy = 0
      },
      release() {
        if (!left.isDown) {
          self.vx = 0
        }
      }
    })

    Object.assign(down, {
      press() {
        // self.vx = 0
        self.vy = 5
      },
      release() {
        if (!up.isDown) {
          self.vy = 0
        }
      }
    })
  }
  
  update(c) {
    c.x += this.vx
    c.y += this.vy
  }

}