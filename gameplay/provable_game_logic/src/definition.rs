// definition.rs
use serde::{Deserialize, Serialize};
use std::fmt;
use wasm_bindgen::prelude::*;

// Structure for initializing the game
#[derive(Clone, Serialize)]
#[wasm_bindgen]
pub struct SpinGameInitArgs {
    pub bird_y_position: u64,
    pub pipe_x_position: u64,
    pub highscore: u64,
    pub player_highscore: u64,
}

#[wasm_bindgen]
impl SpinGameInitArgs {
    #[wasm_bindgen(constructor)]
    pub fn new(bird_y_position: u64, pipe_x_position: u64, highscore: u64, player_highscore: u64) -> SpinGameInitArgs {
        SpinGameInitArgs {
            bird_y_position,
            pipe_x_position,
            highscore,
            player_highscore,
        }
    }
}

// Structure for intermediate game states
#[derive(Clone, Serialize)]
#[wasm_bindgen]
pub struct SpinGameIntermediateStates {
    pub bird_y_position: u64,
    pub pipe_x_position: u64,
    pub highscore: u64,
    pub player_highscore: u64,
}

impl SpinGameIntermediateStates {
    pub fn new() -> SpinGameIntermediateStates {
        SpinGameIntermediateStates {
            bird_y_position: 0,
            pipe_x_position: 0,
            highscore: 0,
            player_highscore: 0,
        }
    }
}

impl fmt::Display for SpinGameIntermediateStates {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "GameState {{ bird_y_position: {}, pipe_x_position: {}, highscore: {}, player_highscore: {} }}",
            self.bird_y_position, self.pipe_x_position, self.highscore, self.player_highscore
        )
    }
}
