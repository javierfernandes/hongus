import { range } from 'ramda'
import Scene from '../../dixy/Scene'
import { image, hitTestRectangle } from '../../utils'

import Explorer from '../components/Explorer'
import Blob from '../components/Blob'

const { loader, Sprite } = PIXI
const { resources } = loader

export default class DungeonScene extends Scene {

  constructor() {
    super()
    this.blobs = []

    loader
      .add(image('treasureHunter.json'))
      .load(::this.setup)
  }

  setup() {
    this.setupCharacters()
    this.setupEnemies()
    this.setupHealthBar()
  }

  setupCharacters() {
    this.id = resources[image('treasureHunter.json')].textures

    // Dungeon
    this.dungeon = new Sprite(this.id['dungeon.png'])
    this.addChild(this.dungeon)

    // Door
    this.door = new Sprite(this.id['door.png'])
    this.door.position.set(32, 0)
    this.addChild(this.door)

    // Explorer
    this.explorer = new Explorer(this.id['explorer.png'])
    this.addChild(this.explorer)
    
    // Treasure
    this.treasure = new Sprite(this.id['treasure.png'])
    this.treasure.x = this.width - this.treasure.width - 48
    this.treasure.y = this.height / 2 - this.treasure.height / 2
    this.addChild(this.treasure)
  }

  setupEnemies() {
    const config = {
      numberOfBlobs: 6,
      spacing: 48,
      xOffset: 150,
      speed: 2,
      direction: -1
    }

    this.blobs = range(0)(config.numberOfBlobs)
      .map(i => new Blob(this.id['blob.png'], config, i, config.direction *= -1))
    this.blobs.forEach(blob => this.addChild(blob))
  }

  setupHealthBar() {
    // Create the health bar
    this.healthBar = new PIXI.DisplayObjectContainer()
    this.healthBar.position.set(this.width - 170, 6)
    this.addChild(this.healthBar)

    const createBar = color => {
      const bar = new PIXI.Graphics()
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
    if (!this.explorer) {
      return
    }
    this.explorer.update()
    this.blobs.forEach(b => b.update())

    this.checkHits()
    this.checkHealth()
  }

  checkHits() {
    if (this.explorerHit) {
      this.explorer.alpha = 0.5
      this.healthBar.outer.width -= 1
    } else {
      this.explorer.alpha = 1
    }
    
    // hits the treasure ?
    if (hitTestRectangle(this.explorer, this.treasure)) {
      this.treasure.x = this.explorer.x + 8
      this.treasure.y = this.explorer.y + 8
    }

    // hits the door ?
    if (hitTestRectangle(this.treasure, this.door)) {
      this.sceneManager.goToScene('youWon')
    }
  }

  checkHealth() {
    if (this.healthBar.outer.width < 0) {
      this.sceneManager.goToScene('youLost')
    }
  }

}