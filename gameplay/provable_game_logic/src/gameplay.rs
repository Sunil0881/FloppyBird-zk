use crate::definition::SpinGameInitArgs;
use crate::definition::SpinGameIntermediateStates;
use crate::spin::SpinGame;
use crate::spin::SpinGameTrait;
use once_cell::sync::Lazy;
use std::sync::Mutex;
use wasm_bindgen::prelude::*;

// Static state for the game
pub static GAME_STATE: Lazy<Mutex<SpinGameIntermediateStates>> =
    Lazy::new(|| Mutex::new(SpinGameIntermediateStates::new()));

impl SpinGameTrait for SpinGame {
    /* STATEFUL FUNCTION This defines the initialization of the game */
    fn initialize_game(args: SpinGameInitArgs) {
        let mut game_state = GAME_STATE.lock().unwrap();

        game_state.game_highscore = 0; // Reset the game high score at the start of the game
        game_state.total_highscore = args.total_highscore; // Set the total high score from args
        game_state.game_status = "NEW_GAME".to_string();
    }

    /* STATEFUL FUNCTION This defines the logic to handle different cases */
    fn step(input: u64, value: Option<u64>) {
        let mut game_state = GAME_STATE.lock().unwrap();

        match input {
            // Case 0: Increment the Game High Score by 1
            0 => {
                game_state.game_highscore += 1;
            }

            // Case 1: Store the pipe and bird positions
            // Assuming pipe and bird positions are passed as the value
            1 => {
                if let Some(position) = value {
                    game_state.pipe_position = position; // Assuming pipe_position exists in the state
                    game_state.bird_position = position; // Assuming bird_position exists in the state
                }
            }

            // Case 3: Update the Total High Score
            3 => {
                if let Some(total_highscore) = value {
                    game_state.total_highscore = total_highscore;
                }
            }

            // Default case: Do nothing
            _ => {}
        }
    }

    /* PURE FUNCTION This function returns the game state, to be used in Rust and Zkmain */
    fn get_game_state() -> SpinGameIntermediateStates {
        let game = GAME_STATE.lock().unwrap().clone();
        return game;
    }
}
