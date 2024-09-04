use provable_game_logic::definition::{SpinGameInitArgs, SpinGameIntermediateStates};
use provable_game_logic::spin::SpinGame;
use wasm_bindgen::prelude::*;
use zkwasm_rust_sdk::{wasm_input, wasm_output};
use provable_game_logic::spin::SpinGameTrait;

/*
    PUBLIC INPUTS marked by `wasm_input`: e.g wasm_input(1) specifies a public input of type u64
    PRIVATE INPUTS marked by `wasm_input`: e.g wasm_input(0) specifies a private input of type u64
    PUBLIC OUTPUTS marked by `wasm_output`: e.g wasm_output(var) specifies an output `var` of type u64
*/
#[wasm_bindgen]
pub fn zkmain() -> i64 {
    // Specify the public input for highscore initialization
    let public_input_total_highscore: u64 = unsafe { wasm_input(1) };
    
    // Initialize the game with the public input as total_highscore
    SpinGame::initialize_game(SpinGameInitArgs {
        total_highscore: public_input_total_highscore,  // Set total_highscore
    });

    // Specify the private inputs (e.g., player actions or other values)
    let private_inputs_length = unsafe { wasm_input(0) };

    // Increment score or handle other actions based on private inputs
    for _i in 0..private_inputs_length {
        SpinGame::step(0, None);  // Increment the game_highscore by 1 on each step
    }

    // Retrieve the final game state
    let final_game_state: SpinGameIntermediateStates = SpinGame::get_game_state();

    unsafe {
        // Output the final game state using the dbg! macro for debugging
        zkwasm_rust_sdk::dbg!("final_game_state: {}\n", final_game_state);

        // Specify the output as the total highscore
        wasm_output(final_game_state.total_highscore as u64);  // Output the total highscore
    }

    0
}
