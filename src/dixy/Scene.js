const { Stage } = PIXI

export default class Scene extends Stage {
  
  constructor(background) {
    super(background)
    
    this.paused = false
    this.updateCB = () => { }
  }

  onUpdate(updateCB) {
    this.updateCB = updateCB
  }

  update() {
    this.updateCB()
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

}