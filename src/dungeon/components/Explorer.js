import Bounded from '../../dixy/traits/Bounded'
import { keyboard, wall } from '../../utils'

const { Container, Sprite } = PIXI

export default class Explorer extends Container {
  constructor(texture) {
    super()
    this.traits = []

    this.sprite = new Sprite(texture)
    this.vx = 0
    this.vy = 0
    this.addChild(this.sprite)

    this.on('added', ::this.componentDidMount)
    
    this.setupKeyboard()
    this.addTrait(new Bounded({ 
      x1: wall.x,
      x2: wall.width,
      y1: wall.y,
      y2: wall.height
    }))
  }

  addTrait(t) {
    this.traits.push(t)
  }

  componentDidMount() {
    this.x = 68
    this.y = this.parent.height / 2 - this.sprite.height / 2
  }

  update() {
    if (this.sprite) {
      this.x = this.x + this.vx
      this.y = this.y + this.vy
    }
    this.traits.forEach(t => t.update(this))
  }

  setupKeyboard() {
    const left = keyboard(37)
    const up = keyboard(38)
    const right = keyboard(39)
    const down = keyboard(40)
    const self = this
    
    Object.assign(left, {
      press() {
        self.vx = -5
        self.vy = 0
      },
      release() {
        if (!right.isDown && self.vy === 0) {
          self.vx = 0
        }
      }
    })
    
    Object.assign(up, {
      press() {
        self.vy = -5;
        self.vx = 0;
      },
      release() {
        if (!down.isDown && self.vx === 0) {
          self.vy = 0;
        }
      }
    })

    Object.assign(right, {
      press() {
        self.vx = 5
        self.vy = 0
      },
      release() {
        if (!left.isDown && self.vy === 0) {
          self.vx = 0
        }
      }
    })

    Object.assign(down, {
      press() {
        self.vy = 5
        self.vx = 0
      },
      release() {
        if (!up.isDown && self.vx === 0) {
          self.vy = 0
        }
      }
    })

  }
}