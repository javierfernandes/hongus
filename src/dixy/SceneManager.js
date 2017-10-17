import Scene from './Scene'

export default class SceneManager {
  
  constructor(width, height, scale = false) {
    this.scenes = {}
    this.currentScene = undefined
    this.ratio = 1;
    this.defaultWidth = width
    this.defaultHeight = height
    this.width = width
    this.height = height
    
    this.renderer = PIXI.autoDetectRenderer(width, height)

    document.body.appendChild(this.renderer.view)

    if (scale) {
      this.rescale();
      window.addEventListener('resize', ::this.rescale, false)
    }
    
    requestAnimationFrame(::this.loop)
  }
  
  loop() {
    requestAnimationFrame(::this.loop)

    if (!this.currentScene || this.currentScene.isPaused()) { return; }
    
    this.currentScene.update()
    
    this.applyRatio(this.currentScene, this.ratio)
    this.renderer.render(this.currentScene)
    this.applyRatio(this.currentScene, 1 / this.ratio)
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

  // scaling

  rescale() {
    this.ratio = Math.min(window.innerWidth / this.defaultWidth, window.innerHeight / this.defaultHeight)
    this.width = this.defaultWidth * this.ratio
    this.height = this.defaultHeight * this.ratio
    this.renderer.resize(this.width, this.height)
  }

  applyRatio(object, ratio) {
    if (ratio === 1) return
    
    object.position.x *= ratio
    object.position.y *= ratio
    object.scale.x *= ratio
    object.scale.y *= ratio

    object.children.forEach(c => this.applyRatio(c, ratio))
  }
}