use provable_game_logic::definition::{SpinGameInitArgs, SpinGameIntermediateStates};
use provable_game_logic::spin::{SpinGame, SpinGameTrait};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn initialize_game(args: SpinGameInitArgs) {
    // Initialize the game using the passed arguments (like total_highscore)
    SpinGame::initialize_game(args);
}

#[wasm_bindgen]
pub fn step(input: u64, value: Option<u64>) {
    // Call step with the input and value to handle the different cases
    SpinGame::step(input, value);
}

#[wasm_bindgen]
pub fn get_game_state() -> SpinGameIntermediateStates {
    // Return the current state of the game
    SpinGame::get_game_state()
}
