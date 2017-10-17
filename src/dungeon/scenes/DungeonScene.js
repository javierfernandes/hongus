import { range } from 'ramda'
import Scene from '../../dixy/Scene'
import { image, hitTestRectangle } from '../../utils'

import Explorer from '../components/Explorer'
import Blob from '../components/Blob'
import Fruit from '../components/Fruit'
import HealthBar from '../components/HealthBar'

const { loader, Sprite, Texture } = PIXI
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
    
    this.healthBar = new HealthBar()
    this.healthBar.setProps({
      onEnergyConsumed: ::this.onEnergyConsumed
    })
    this.addChild(this.healthBar)
  }

  onEnergyConsumed() {
    this.sceneManager.goToScene('youLost')
  }

  setupCharacters() {
    this.id = resources[image('treasureHunter.json')].textures

    // Dungeon
    this.addChild(new Sprite(this.id['dungeon.png']))

    // Door
    this.door = new Sprite(this.id['door.png'])
    this.door.position.set(32, 0)
    this.addChild(this.door)

    // Explorer
    this.explorer = new Explorer(this.id['explorer.png'])
    this.addChild(this.explorer)
    
    // Fruit
    this.fruit = new Fruit(Texture.fromImage(image('fruit.png')))
    this.addChild(this.fruit)

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

  update() {
    if (!this.explorer) {
      return
    }
    super.update()
    this.checkHits()
  }

  checkHits() {
    if (this.explorerHit) {
      this.explorer.alpha = 0.5
      this.healthBar.reduce()
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

}