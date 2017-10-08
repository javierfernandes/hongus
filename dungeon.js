
const {
  Container, 
  autoDetectRenderer,
  loader,
  Texture,
  Sprite,
  Text,
  Graphics
} = PIXI
const { resources } = PIXI.loader
const { TextureCache } = PIXI.utils

const stage = new Container()
const renderer = autoDetectRenderer(512, 512)
document.body.appendChild(renderer.view)


class Game {
  constructor() {
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

    renderer.render(stage)
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
    stage.addChild(this.gameScene)

    this.gameOverScene = new Container()
    this.gameOverScene.visible = false
    stage.addChild(this.gameOverScene)
  }

  // let id, dungeon, door, explorer, treasure
  setupCharacters () {
    this.id = resources['treasureHunter.json'].textures

    //Dungeon
    this.dungeon = new Sprite(this.id["dungeon.png"])
    this.gameScene.addChild(this.dungeon)

    //Door
    this.door = new Sprite(this.id["door.png"])
    this.door.position.set(32, 0)
    this.gameScene.addChild(this.door)

    //Explorer
    this.explorer = new Sprite(this.id["explorer.png"])
    this.explorer.x = 68
    this.explorer.y = this.gameScene.height / 2 - this.explorer.height / 2
    this.explorer.vx = 0
    this.explorer.vy = 0
    this.gameScene.addChild(this.explorer)

    //Treasure
    this.treasure = new Sprite(this.id["treasure.png"])
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
      blob.y = randomInt(0, stage.height - blob.height)
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
    this.healthBar.position.set(stage.width - 170, 6)
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
      { font: "64px Futura", fill: "white" }
    )

    this.message.x = 120
    this.message.y = stage.height / 2 - 32

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

//
// START IT !
// 

const game = new Game()

loader
  .add('treasureHunter.json')
  .load(game.setup.bind(game))


// UTILITIES

const range = start => end => new Array(end - start).fill().map((d, i) => i + start)


function contain(sprite, container) {
  var collision = undefined;

  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  //Return the `collision` value
  return collision;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  //hit will determine whether there's a collision
  hit = false;
  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2; 
  r1.centerY = r1.y + r1.height / 2; 
  r2.centerX = r2.x + r2.width / 2; 
  r2.centerY = r2.y + r2.height / 2; 
  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;
  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;
  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }
  //`hit` will be either `true` or `false`
  return hit;
}

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };
  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };
  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
