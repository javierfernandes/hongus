
export function contain(sprite, container) {
  let collision

  // Left
  if (sprite.x < container.x) {
    sprite.x = container.x
    collision = 'left'
  }

  // Top
  if (sprite.y < container.y) {
    sprite.y = container.y
    collision = 'top'
  }

  // Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width
    collision = 'right'
  }

  // Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height
    collision = 'bottom'
  }

  return collision
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function hitTestRectangle(r1, r2) {
  
  // Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2 
  r1.centerY = r1.y + r1.height / 2
  r2.centerX = r2.x + r2.width / 2 
  r2.centerY = r2.y + r2.height / 2
  
  // Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2
  r1.halfHeight = r1.height / 2
  r2.halfWidth = r2.width / 2
  r2.halfHeight = r2.height / 2
  
  // Calculate the distance vector between the sprites
  const vx = r1.centerX - r2.centerX;
  const vy = r1.centerY - r2.centerY;
  
  // Figure out the combined half-widths and half-heights
  const combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  const combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  const collides = Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights
  return collides
}

export function keyboard(keyCode) {
  const key = {
    code: keyCode,
    isDown: false,
    isUp: true,
    press: undefined,
    release: undefined,

    downHandler(event) {
      if (event.keyCode === this.code) {
        if (this.isUp && this.press) this.press()
        this.isDown = true
        this.isUp = false
      }
      event.preventDefault()
    },
    upHandler(event) {
      if (event.keyCode === this.code) {
        if (this.isDown && this.release) this.release()
        this.isDown = false
        this.isUp = true
      }
      event.preventDefault()
    }
  }
  
  // Attach event listeners
  window.addEventListener('keydown', ::key.downHandler, false)
  window.addEventListener('keyup', ::key.upHandler, false)
  return key
}

export const image = file => `/res/images/${file}`