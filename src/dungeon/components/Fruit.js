import Component from '../../dixy/Component'
import { randomInt } from '../../utils'

const { Sprite } = PIXI

export default class Fruit extends Component {
  constructor(texture) {
    super()

    this.sprite = new Sprite(texture)
    this.addChild(this.sprite)
  }
  
  componentDidMount() {
    this.x = randomInt(0, this.parent.width - this.sprite.width)
    this.y = randomInt(0, this.parent.height - this.sprite.height)
  }
}