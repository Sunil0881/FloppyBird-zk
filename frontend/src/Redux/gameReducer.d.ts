// Declare the module for gameSlice
declare module './gameSlice' {
    // Define the GameState interface
    interface GameState {
      game: {
        status: 'NEW_GAME' | 'PLAYING' | 'GAME_OVER'; // Union type for game status
        score: number;
        highScore: number;
      };
    }
  
    // Declare action payloads (if needed)
    interface StartAction {
      type: 'game/start';
      payload?: undefined;
    }
  
    interface GameOverAction {
      type: 'game/gameOver';
      payload?: undefined;
    }
  
    interface NewGameAction {
      type: 'game/newGame';
      payload?: undefined;
    }
  
    interface AddScoreAction {
      type: 'game/addScore';
      payload?: undefined;
    }
  
    // Export the actions
    export const start: StartAction;
    export const gameOver: GameOverAction;
    export const newGame: NewGameAction;
    export const addScore: AddScoreAction;
  
    // Export the gameSlice reducer
    export default function gameReducer(state: GameState, action: any): GameState;
  }
  