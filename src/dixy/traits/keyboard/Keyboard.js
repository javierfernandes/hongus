import { keyboard } from '../../../utils'

export const Key = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40
}

export const handleArrows = target => {
  target.keyboard = {
    left: keyboard(Key.LEFT, ::target.startMovingLeft, ::target.stopMovingLeft),
    up: keyboard(Key.UP, ::target.startMovingUp, ::target.stopMovingUp),
    right: keyboard(Key.RIGHT, ::target.startMovingRight, ::target.stopMovingRight),
    down: keyboard(Key.DOWN, ::target.startMovingDown, ::target.stopMovingDown),
  }
}

