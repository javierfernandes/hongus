import Scene from './Scene'

export default class SceneManager {
  
  constructor(width, height) {
    this.scenes = {}
    this.currentScene = undefined
    this.renderer = PIXI.autoDetectRenderer(width, height)

    document.body.appendChild(this.renderer.view)
    
    requestAnimationFrame(::this.loop)
  }
  
  loop() {
    requestAnimationFrame(::this.loop)

    if (!this.currentScene || this.currentScene.isPaused()) { return; }
    
    this.currentScene.update()
    
    this.renderer.render(this.currentScene)
  }

  // 

  createScene(id, sceneClass = Scene, ...args) {
    const scene = new sceneClass(...args)
    return this.addScene(id, scene)
  }

  addScene(id, scene) {
    if (this.scenes[id]) {
      return undefined
    }
    this.scenes[id] = scene
    scene.setSceneManager(this)
    return scene
  }

  goToScene(id) {
    if (this.scenes[id]) {
      if (this.currentScene) {
        this.currentScene.pause()
      }

      this.currentScene = this.scenes[id]
      this.currentScene.resume()
      return true
    }
    return false
  }
}