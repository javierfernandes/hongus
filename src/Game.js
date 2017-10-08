
export default class Game {
  constructor(stage, renderer) {
    this.stage = stage
    this.renderer = renderer

    this.state = undefined
    this.gameScene = undefined
    this.gameOverScene = undefined
  }

  // GENERAL Game Structure

  setup() {
    this.doSetup()

    this.state = this.play.bind(this)

    this.gameLoop()
  }

  gameLoop() {
    requestAnimationFrame(this.gameLoop.bind(this))

    this.state()

    this.renderer.render(this.stage)
  }

  // abstract
  doSetup() { }

  play() { }

  end() {
    this.gameScene.visible = false
    this.gameOverScene.visible = true
  }

}
