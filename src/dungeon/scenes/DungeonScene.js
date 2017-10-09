import { range } from 'ramda'
import Scene from '../../dixy/Scene'
import { image, randomInt, keyboard, contain, hitTestRectangle } from '../../utils'

const { loader, Sprite } = PIXI
const { resources } = loader

const { TextureCache } = PIXI.utils

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
    this.setupKeyboard()
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
    this.explorer = new Sprite(this.id['explorer.png'])
    this.explorer.x = 68
    this.explorer.y = this.height / 2 - this.explorer.height / 2
    this.explorer.vx = 0
    this.explorer.vy = 0
    this.addChild(this.explorer)
    

    //Treasure
    this.treasure = new Sprite(this.id['treasure.png'])
    this.treasure.x = this.width - this.treasure.width - 48
    this.treasure.y = this.height / 2 - this.treasure.height / 2
    this.addChild(this.treasure)
  }

  setupEnemies() {
    const numberOfBlobs = 6
    const spacing = 48
    const xOffset = 150
    const speed = 2
    let direction = 1

    this.blobs = range(0)(numberOfBlobs).map(i => {
      const blob = new Sprite(this.id['blob.png'])

      blob.x = spacing * i + xOffset
      blob.y = randomInt(0, this.height - blob.height)
      blob.vy = speed * direction
      
      this.addChild(blob)
      
      direction *= -1
      return blob
    })  
  }

  setupHealthBar() {
    //Create the health bar
    this.healthBar = new PIXI.DisplayObjectContainer()
    this.healthBar.position.set(this.width - 170, 6)
    this.addChild(this.healthBar)

    const createBar = color => {
      let bar = new PIXI.Graphics()
      bar.beginFill(color)
      bar.drawRect(0, 0, 128, 8)
      bar.endFill()
      this.healthBar.addChild(bar)
      return bar
    }

    // Create the black background rectangle
    createBar(0x000000)
    //Create the front red rectangle
    this.healthBar.outer = createBar(0xFF3300)
  }

  setupKeyboard() {
    const left = keyboard(37)
    const up = keyboard(38)
    const right = keyboard(39)
    const down = keyboard(40)
    const self = this
    
    Object.assign(left, {
      press() {
        self.explorer.vx = -5
        self.explorer.vy = 0
      },
      release() {
        if (!right.isDown && self.explorer.vy === 0) {
          self.explorer.vx = 0
        }
      }
    })
    
    Object.assign(up, {
      press() {
        self.explorer.vy = -5;
        self.explorer.vx = 0;
      },
      release() {
        if (!down.isDown && self.explorer.vx === 0) {
          self.explorer.vy = 0;
        }
      }
    })

    Object.assign(right, {
      press() {
        self.explorer.vx = 5
        self.explorer.vy = 0
      },
      release() {
        if (!left.isDown && self.explorer.vy === 0) {
          self.explorer.vx = 0
        }
      }
    })

    Object.assign(down, {
      press() {
        self.explorer.vy = 5
        self.explorer.vx = 0
      },
      release() {
        if (!up.isDown && self.explorer.vx === 0) {
          self.explorer.vy = 0
        }
      }
    })

  }

  update() {
    if (!this.explorer) {
      return
    }
    this.moveExplorer()
    this.moveEnemies()
    this.checkHits()
    this.checkHealth()
  }

  moveExplorer() {
    if (this.explorer) {
      this.explorer.x += this.explorer.vx
      this.explorer.y += this.explorer.vy
    }
  }

  moveEnemies() {
    this.explorerHit = false
    this.blobs.forEach(blob => {
      blob.y += blob.vy
      const blobHitsWall = contain(blob, { x: 28, y: 10, width: 488, height: 480 })
      if (blobHitsWall === 'top' || blobHitsWall === 'bottom') {
        blob.vy *= -1
      }
      if(hitTestRectangle(this.explorer, blob)) {
        this.explorerHit = true
      }
    })
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