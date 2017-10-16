const { Stage } = PIXI

export default class Scene extends Stage {
  
  constructor(background) {
    super(background)
    
    this.paused = false
    this.components = []
  }

  update() {
    this.components.forEach(c => {
      if (c.update) {
        c.update()
      }
    })
  }
  pause() {
    this.paused = true
  }
  resume() {
    this.paused = false
  }
  isPaused() {
    return this.paused;
  }

  setSceneManager(manager) {
    this.sceneManager = manager
  }

  addChild(c) {
    super.addChild(c)
    this.components.push(c)
  }

}