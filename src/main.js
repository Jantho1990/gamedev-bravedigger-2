import pop from '../pop'
const { Game, KeyControls, entity, math, Text } = pop
import GameScreen from './GameScreen'

const game = new Game(48 * 19, 48 * 11)
const keys = new KeyControls()
function startGame() {
  game.scene = new GameScreen(game, keys, startGame)
}
startGame()
game.run()