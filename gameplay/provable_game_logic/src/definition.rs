use serde::{Deserialize, Serialize};
use std::fmt;
use wasm_bindgen::prelude::*;

#[derive(Clone, Serialize)]
#[wasm_bindgen]
pub struct SpinGameInitArgs {
    pub y_position: u64,
    pub pipe_x_position: u64,
    pub pipe_gap_start: u64,
    pub highscore: u64,
}

#[wasm_bindgen]
impl SpinGameInitArgs {
    #[wasm_bindgen(constructor)]
    pub fn new(y_position: u64, pipe_x_position: u64, pipe_gap_start: u64, highscore: u64) -> SpinGameInitArgs {
        SpinGameInitArgs {
            y_position,
            pipe_x_position,
            pipe_gap_start,
            highscore,
        }
    }
}

#[derive(Clone, Serialize)]
#[wasm_bindgen]
pub struct SpinGameIntermediateStates {
    pub y_position: u64,           // Bird's vertical position
    pub pipe_x_position: u64,      // Pipe's horizontal position
    pub pipe_gap_start: u64,       // Start position of the gap in the pipe
    pub highscore: u64,            // Player's current high score
    pub is_game_over: bool,        // Flag indicating whether the game is over
}

impl SpinGameIntermediateStates {
    pub fn new() -> SpinGameIntermediateStates {
        SpinGameIntermediateStates {
            y_position: 5,              // Bird starts in the middle
            pipe_x_position: 10,        // Pipe starts at the far right
            pipe_gap_start: 3,          // Pipe gap starts at the middle
            highscore: 0,               // No score at the start
            is_game_over: false,        // Game starts as active (not over)
        }
    }
}

impl fmt::Display for SpinGameIntermediateStates {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "GameState {{ y_position: {}, pipe_x_position: {}, pipe_gap_start: {}, highscore: {}, is_game_over: {} }}",
            self.y_position, self.pipe_x_position, self.pipe_gap_start, self.highscore, self.is_game_over
        )
    }
}
