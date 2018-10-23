import pop from '../pop'
const { Game, KeyControls, entity, math, Text } = pop
import GameScreen from './screens/GameScreen'
import TitleScreen from './screens/TitleScreen';

const game = new Game(48 * 19, 48 * 9)
const controls = {
  keys: new KeyControls()
}

function title () {
  game.scene = new TitleScreen(game, controls, startGame)
}

function startGame() {
  game.scene = new GameScreen(game, controls, title)
}

title()

game.run(() => {
  /* for (let i = 0; i < 1000; i++) {
    console.log('This is MAYHEM')
  } */
})