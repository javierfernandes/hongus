import Component from './Component'

export default class Scene extends Component {
  
  constructor(background) {
    super(background)
    
    this.shown = false
    this.paused = false
    this.components = []
  }

  onFirstTimeShow() { }

  setSceneManager(manager) {
    this.sceneManager = manager
  }

  pause() { this.paused = true }
  resume() { 
    this.paused = false
    if (!this.shown) {
      this.onFirstTimeShow()
    }
    this.shown = true
  }
  isPaused() { return this.paused }

  update() {
    super.update()
    this.components.forEach(c => {
      if (c.update) {
        c.update()
      }
    })
  }

  addChild(c) {
    super.addChild(c)
    this.components.push(c)
  }

}