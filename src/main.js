import pop from '../pop'
const { Game, KeyControls, entity, math, Text } = pop
import GameScreen from './screens/GameScreen'
import TitleScreen from './screens/TitleScreen';

const game = new Game(48 * 19, 48 * 9)
const controls = {
  keys: new KeyControls()
}

const defaults = () => ({
  newGame: true,
  level: 1,
  doors: { '1': true },
  data: {},
  hp: 5,
  score: 0,
  spawn: null
})

let state = defaults()

function title () {
  state = defaults()
  game.setScene(
    new TitleScreen(game, controls, () => startGame(1)),
    0
  )
}

function startGame(toLevel, spawn) {
  state.level = toLevel
  state.spawn = spawn

  game.setScene(
    new GameScreen(game, controls, state, {
      onLevel: startGame,
      onReset: title
    })
  )
}

title()

game.run(() => {
  /* for (let i = 0; i < 1000; i++) {
    console.log('This is MAYHEM')
  } */
})