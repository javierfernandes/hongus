import 'pixi.js'

import SceneManager from './dixy/SceneManager'
import DungeonScene from './dungeon/scenes/DungeonScene'
import EndScene from './dungeon/scenes/EndScene'

const manager = new SceneManager(512, 512)
manager.createScene('dungeon', DungeonScene)
manager.createScene('youWon', EndScene, 'You Won!')
manager.createScene('youLost', EndScene, 'You Lost!')

manager.goToScene('dungeon')

