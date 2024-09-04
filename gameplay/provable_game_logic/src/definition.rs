use serde::{Deserialize, Serialize};
use std::fmt;
use wasm_bindgen::prelude::*;

// This struct defines the initialization arguments for the game
#[derive(Clone, Serialize, Deserialize)]
#[wasm_bindgen]
pub struct SpinGameInitArgs {
    pub total_highscore: u64, // Total high score across all games
}

#[wasm_bindgen]
impl SpinGameInitArgs {
    #[wasm_bindgen(constructor)]
    pub fn new(total_highscore: u64) -> SpinGameInitArgs {
        SpinGameInitArgs { total_highscore }
    }
}

// This struct holds the intermediate states of the game
#[derive(Clone, Serialize, Deserialize)]
#[wasm_bindgen]
pub struct SpinGameIntermediateStates {
    pub game_highscore: u64,  // High score for the current game session
    pub total_highscore: u64, // Global high score across all games
    pub pipe_position: u64,   // Current position of the pipe (example)
    pub bird_position: u64,   // Current position of the bird (example)
}

impl SpinGameIntermediateStates {
    // Initializes a new game state with default values
    pub fn new() -> SpinGameIntermediateStates {
        SpinGameIntermediateStates {
            game_highscore: 0,  // Initialize game high score as 0
            total_highscore: 0, // Initialize total high score as 0
            pipe_position: 0,   // Initialize pipe position as 0
            bird_position: 0,   // Initialize bird position as 0
        }
    }
}

// Implement the Display trait to nicely print the game state
impl fmt::Display for SpinGameIntermediateStates {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "GameState {{ game_highscore: {}, total_highscore: {}, pipe_position: {}, bird_position: {} }}",
            self.game_highscore, self.total_highscore, self.pipe_position, self.bird_position
        )
    }
}
