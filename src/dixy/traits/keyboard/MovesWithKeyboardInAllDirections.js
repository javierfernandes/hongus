import MovesWithKeyboard from './MovesWithKeyboard'

// this should be deleted and just parametrized into superclass

export default class MovesWithKeyboardInAllDirections extends MovesWithKeyboard {

  constructor() {
    super()
    this.stopsOtherMovement = false
  }

}