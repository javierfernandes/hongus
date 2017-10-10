import { contain, randomInt } from '../../utils'

const { Container, Sprite } = PIXI

export default class Blob extends Container {
  constructor(texture, { speed, spacing, xOffset }, i, direction) {
    super()

    this.sprite = new Sprite(texture)
    this.x = spacing * i + xOffset
    this.vy = speed * direction
    this.addChild(this.sprite)
    
    this.on('added', ::this.componentDidMount)
  }

  componentDidMount() {
    this.y = randomInt(0, this.parent.height - this.sprite.height)
  }

  update() {
    this.explorerHit = false
    
    this.y += this.vy
    const blobHitsWall = contain(this, {
      x: 28, y: 10, width: 488, height: 480 
    })
    if (blobHitsWall === 'top' || blobHitsWall === 'bottom') {
      this.vy *= -1
    }
    
    // TODO: take to collisionable / collision detector
    // if(hitTestRectangle(this.explorer, this)) {
    //   this.explorerHit = true
    // }
  }
}