import { keyboard } from '../../utils'

const { Container, Sprite } = PIXI

export default class Explorer extends Container {
  constructor(texture) {
    super()
    this.sprite = new Sprite(texture)
    this.sprite.vx = 0
    this.sprite.vy = 0
    this.addChild(this.sprite)

    this.on('added', ::this.componentDidMount)
    this.setupKeyboard()
  }

  componentDidMount() {
    this.sprite.x = 68
    this.sprite.y = this.parent.height / 2 - this.sprite.height / 2
  }

  update() {
    if (this.sprite) {
      this.sprite.x += this.sprite.vx
      this.sprite.y += this.sprite.vy
    }
  }

  setupKeyboard() {
    const left = keyboard(37)
    const up = keyboard(38)
    const right = keyboard(39)
    const down = keyboard(40)
    const self = this
    
    Object.assign(left, {
      press() {
        self.sprite.vx = -5
        self.sprite.vy = 0
      },
      release() {
        if (!right.isDown && self.sprite.vy === 0) {
          self.sprite.vx = 0
        }
      }
    })
    
    Object.assign(up, {
      press() {
        self.sprite.vy = -5;
        self.sprite.vx = 0;
      },
      release() {
        if (!down.isDown && self.sprite.vx === 0) {
          self.sprite.vy = 0;
        }
      }
    })

    Object.assign(right, {
      press() {
        self.sprite.vx = 5
        self.sprite.vy = 0
      },
      release() {
        if (!left.isDown && self.sprite.vy === 0) {
          self.sprite.vx = 0
        }
      }
    })

    Object.assign(down, {
      press() {
        self.sprite.vy = 5
        self.sprite.vx = 0
      },
      release() {
        if (!up.isDown && self.sprite.vx === 0) {
          self.sprite.vy = 0
        }
      }
    })

  }
}