import Component from '../../dixy/Component'
import MovesWithKeyboard from '../../dixy/traits/keyboard/MovesWithKeyboard'
import Bounded from '../../dixy/traits/Bounded'
import { wall } from '../../utils'

const { Sprite } = PIXI

export default class Explorer extends Component {
  constructor(texture) {
    super()

    this.sprite = new Sprite(texture)
    this.addChild(this.sprite)
   
    this.addTrait(new MovesWithKeyboard())
    this.addTrait(new Bounded({ 
      x1: wall.x,
      x2: wall.width,
      y1: wall.y,
      y2: wall.height
    }))
  }

  componentDidMount() {
    this.x = 68
    this.y = this.parent.height / 2 - this.sprite.height / 2
  }

}