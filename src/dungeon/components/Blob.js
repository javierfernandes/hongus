import Component from '../../dixy/Component'
import { randomInt, hitsTheWall } from '../../utils'

const { Sprite } = PIXI

export default class Blob extends Component {
  constructor(texture, { speed, spacing, xOffset }, i, direction) {
    super()

    this.sprite = new Sprite(texture)
    this.x = spacing * i + xOffset
    this.vy = speed * direction
    this.addChild(this.sprite)
  }

  componentDidMount() {
    this.y = randomInt(0, this.parent.height - this.sprite.height)
  }

  update() {
    super.update()
    this.explorerHit = false
    
    this.y += this.vy
    const hits = hitsTheWall(this)
    if (hits === 'top' || hits === 'bottom') {
      this.vy *= -1
    }
    
    // TODO: take to collisionable / collision detector
    // if(hitTestRectangle(this.explorer, this)) {
    //   this.explorerHit = true
    // }
  }
}