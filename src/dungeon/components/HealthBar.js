import Component from '../../dixy/Component'

const { Graphics, DisplayObjectContainer } = PIXI

export default class HealthBar extends Component {

  componentDidMount() {
    this.healthBar = new DisplayObjectContainer()
    this.addChild(this.healthBar)

    const createBar = color => {
      const bar = new Graphics()
      bar.beginFill(color)
      bar.drawRect(0, 0, 128, 8)
      bar.endFill()
      this.healthBar.addChild(bar)
      return bar
    }

    // Create the black background rectangle
    createBar(0x000000)
    // Create the front red rectangle
    this.healthBar.outer = createBar(0xFF3300)
  }

  update() {
    super.update()
    this.healthBar.position.set(this.width - 170, 6)

    if (this.healthBar.outer.width < 0) {
      this.props.onEnergyConsumed()
    }
  }

  // hack for the moment
  reduce() {
    this.healthBar.outer.width -= 1
  }
}