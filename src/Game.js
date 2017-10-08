import { range } from 'ramda'
import { contain, hitTestRectangle, keyboard, randomInt, image } from './utils'

const {
  Container, 
  autoDetectRenderer,
  loader,
  Texture,
  Sprite,
  Text,
  Graphics
} = PIXI

const { resources } = loader

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
    this.setupScenes()
    this.setupCharacters()
    this.setupEnemies()
    this.setupHealthBar()
    this.setupGameOverText()
    this.setupKeyboard()

    //Assign the player's keyboard controllers

    this.state = this.play.bind(this)

    this.gameLoop()
  }

  gameLoop() {
    requestAnimationFrame(this.gameLoop.bind(this))

    this.state()

    this.renderer.render(this.stage)
  }

  play() {
    this.moveExplorer()
    this.moveEnemies()

    this.checkHits()

    this.checkHealth()
  }

  end() {
    this.gameScene.visible = false
    this.gameOverScene.visible = true
  }

  // SPECIFIC METHODS

  // gameScene, gameOverScene
  setupScenes() {
    this.gameScene = new Container()
    this.stage.addChild(this.gameScene)

    this.gameOverScene = new Container()
    this.gameOverScene.visible = false
    this.stage.addChild(this.gameOverScene)
  }

  // let id, dungeon, door, explorer, treasure
  setupCharacters () {
    this.id = resources[image('treasureHunter.json')].textures

    // Dungeon
    this.dungeon = new Sprite(this.id['dungeon.png'])
    this.gameScene.addChild(this.dungeon)

    // Door
    this.door = new Sprite(this.id['door.png'])
    this.door.position.set(32, 0)
    this.gameScene.addChild(this.door)

    // Explorer
    this.explorer = new Sprite(this.id['explorer.png'])
    this.explorer.x = 68
    this.explorer.y = this.gameScene.height / 2 - this.explorer.height / 2
    this.explorer.vx = 0
    this.explorer.vy = 0
    this.gameScene.addChild(this.explorer)

    //Treasure
    this.treasure = new Sprite(this.id['treasure.png'])
    this.treasure.x = this.gameScene.width - this.treasure.width - 48
    this.treasure.y = this.gameScene.height / 2 - this.treasure.height / 2
    this.gameScene.addChild(this.treasure)
  }

  // let blobs
  setupEnemies() {
    const numberOfBlobs = 6
    const spacing = 48
    const xOffset = 150
    const speed = 2
    let direction = 1

    this.blobs = range(0)(numberOfBlobs).map(i => {
      const blob = new Sprite(this.id['blob.png'])

      blob.x = spacing * i + xOffset
      blob.y = randomInt(0, this.stage.height - blob.height)
      blob.vy = speed * direction
      
      this.gameScene.addChild(blob)
      
      direction *= -1
      return blob
    })  

  }

  // let healthBar;

  setupHealthBar() {
    //Create the health bar
    this.healthBar = new PIXI.DisplayObjectContainer()
    this.healthBar.position.set(this.stage.width - 170, 6)
    this.gameScene.addChild(this.healthBar)

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

  // let message
  setupGameOverText() {
    this.message = new Text(
      'The End!',
      { font: '64px Futura', fill: 'white' }
    )

    this.message.x = 120
    this.message.y = this.stage.height / 2 - 32

    this.gameOverScene.addChild(this.message)
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

  moveExplorer() {
    this.explorer.x += this.explorer.vx
    this.explorer.y += this.explorer.vy
  }

  // let explorerHit = false
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

      // Reduce the width of the health bar's inner rectangle by 1 pixel
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
      this.state = this.end.bind(this)
      this.message.text = 'You won!'
    }
  }

  checkHealth() {
    if (this.healthBar.outer.width < 0) {
      this.state = this.end.bind(this)
      this.message.text = 'You lost!'
    }
  }

}
