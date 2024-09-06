// gameplay.rs
use crate::definition::SpinGameInitArgs;
use crate::definition::SpinGameIntermediateStates;
use crate::spin::SpinGame;
use crate::spin::SpinGameTrait;
use once_cell::sync::Lazy;
use std::sync::Mutex;
use wasm_bindgen::prelude::*;

pub const MAX_POSITION: u64 = 100; // Adjust as needed

pub static GAME_STATE: Lazy<Mutex<SpinGameIntermediateStates>> =
    Lazy::new(|| Mutex::new(SpinGameIntermediateStates::new()));

impl SpinGameTrait for SpinGame {
    /* STATEFUL FUNCTIONS This defines the initialization of the game */
    fn initialize_game(args: SpinGameInitArgs) {
        let mut game_state = GAME_STATE.lock().unwrap();

        game_state.bird_y_position = args.bird_y_position;
        game_state.pipe_x_position = args.pipe_x_position;
        game_state.highscore = args.highscore;
        game_state.player_highscore = args.player_highscore;
    }

    /* STATEFUL FUNCTIONS This defines the logic when the player makes a move */
    fn step(input: u64) {
        let mut game_state = GAME_STATE.lock().unwrap();

        match input {
            0 => { // Move the bird up
                game_state.bird_y_position = game_state.bird_y_position.saturating_sub(1);
            }
            1 => { // Move the bird down
                game_state.bird_y_position += 1;
            }
            2 => { // Update score
                if game_state.player_highscore > game_state.highscore {
                    game_state.highscore = game_state.player_highscore;
                }
                game_state.player_highscore += 1;
            }
            _ => {
                panic!("Invalid command");
            }
        };

        // Example of boundary enforcement (e.g., keeping bird within bounds)
        if game_state.bird_y_position > MAX_POSITION {
            game_state.bird_y_position = MAX_POSITION;
        }
    }

    /* PURE FUNCTION This function returns the game state */
    fn get_game_state() -> SpinGameIntermediateStates {
        let game = GAME_STATE.lock().unwrap().clone();
        game
    }
}
