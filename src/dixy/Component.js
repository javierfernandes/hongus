const { Container } = PIXI

export default class Component extends Container {
  
  constructor() {
    super()
    this.props = {}
    this.traits = []

    this.on('added', ::this.componentDidMount)
    this.on('removed', ::this.componentDidUnmount)
  }

  setProps(props) {
    this.props = props
  }

  componentDidMount() {}
  componentDidUnmount() {}

  addTrait(t) {
    this.traits.push(t)
  }

  update() {
    this.traits.forEach(t => t.update(this))
  }
}