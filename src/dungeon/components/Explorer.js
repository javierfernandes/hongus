import MovesWithKeyboard from '../../dixy/traits/keyboard/MovesWithKeyboard'
import Bounded from '../../dixy/traits/Bounded'
import { wall } from '../../utils'

const { Container, Sprite } = PIXI

export default class Explorer extends Container {
  constructor(texture) {
    super()
    this.traits = []

    this.sprite = new Sprite(texture)
    this.addChild(this.sprite)

    this.on('added', ::this.componentDidMount)
    
    this.addTrait(new MovesWithKeyboard())
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
      this.traits.forEach(t => t.update(this))
    }
  }

}