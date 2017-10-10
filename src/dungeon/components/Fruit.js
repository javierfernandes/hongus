import { randomInt } from '../../utils'

const { Container, Sprite } = PIXI

export default class Fruit extends Container {
  constructor(texture) {
    super()

    this.sprite = new Sprite(texture)
    this.addChild(this.sprite)
    
    this.on('added', ::this.componentDidMount)
  }
  
  componentDidMount() {
    this.x = randomInt(0, this.parent.width - this.sprite.width)
    this.y = randomInt(0, this.parent.height - this.sprite.height)
  }
}