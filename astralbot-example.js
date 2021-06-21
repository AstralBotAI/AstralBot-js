#!/usr/bin/env node

let astralUrl = 'localhost:8080';
const AstralBot = require('astralbot').AstralBot;

const params = process.argv.slice(2);
if(params.length === 1) {
  astralUrl = params[0]
}
console.log('url: ', astralUrl);

class GameBot {
  constructor(supportedGame) {
    this.supportedGame = supportedGame;
    this.previousState = null;
  }

  engineStateTransition(engine) {
    const state = engine.state;
    if(state !== this.previousState) {
      this.previousState = state;
      return state;
    }
    return null;
  }

  loop(engine, game) {
    let action = {};
    const newState = this.engineStateTransition(engine);
    console.log(" * Engine data:", engine);
    console.log(" * Game data:", game);

    // click in the first box when transition from started to ready.
    if(newState) {
      console.log(" * State transition detected", newState);
      if(newState === "initialized") {
        if(engine.games.indexOf(this.supportedGame) !== -1) {
          console.log("Please astralBot, start the game", this.supportedGame);
          action = {command: "start", args: {name: this.supportedGame} };
        }
        else {
          console.log("ERROR: the astralBot instance does not support the game", this.supportedGame);
        }
      }
      // Make the first move when the game is ready
      else if(newState === "started") {
        console.log("Please astralBot, click at 20,60");
        action = {command: "clickAt", args: {x: 20, y:60} };
      }
      else {
        console.log("Nothing to do");
      }
    }

    return action;
  }
};

const gb = new GameBot("minesweeper_beginner");
const ab = new AstralBot(astralUrl, {verbose: true}, gb.loop.bind(gb) );
// save all received screen in the disk
// ab.enableScreenSaving();

// In the case the astral engine is protected you can add authentication informations
// ab.setAuth("myBot", "v1.0.0", "t0ken");

// connect and run the bot
ab.run();
