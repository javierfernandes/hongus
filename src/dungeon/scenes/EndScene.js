import Scene from '../../dixy/Scene'

const { loader, Sprite, Text } = PIXI
const { resources } = loader

export default class EndScene extends Scene {

  constructor(text) { 
    super()
    
    this.message = new Text(text, { font: '64px Futura', fill: 'white' })

    this.message.x = 120

    this.addChild(this.message)
  }

  update() {
    if (!this.message.y) {
      this.message = this.height / 2 - 32
    }
  }

}