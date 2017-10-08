import 'pixi.js'
import { image } from './utils'
import DungeonGame from './DungeonGame'

const {
  Container, 
  autoDetectRenderer,
  loader,
  Texture,
  Sprite,
  Text,
  Graphics
} = PIXI

const { TextureCache } = PIXI.utils

const stage = new Container()
const renderer = autoDetectRenderer(512, 512)
document.body.appendChild(renderer.view)

const game = new DungeonGame(stage, renderer)

loader
  .add(image('treasureHunter.json'))
  .load(game.setup.bind(game))
