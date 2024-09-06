use provable_game_logic::definition::SpinGameInitArgs;
use provable_game_logic::definition::SpinGameIntermediateStates;
use provable_game_logic::spin::SpinGame;
use wasm_bindgen::prelude::*;
use zkwasm_rust_sdk::wasm_input;
use zkwasm_rust_sdk::wasm_output;

use provable_game_logic::spin::SpinGameTrait;

/*
    PUBLIC INPUTS marked by `wasm_input`: e.g wasm_input(1) specifies a public input of type u64
    PRIVATE INPUTS marked by `wasm_input`: e.g wasm_input(0) specifies a private input of type u64
    PUBLIC OUTPUTS marked by `wasm_output`: e.g wasm_output(var) specifies an output `var` of type u64
*/
#[wasm_bindgen]
pub fn zkmain() -> i64 {
    // specify the public inputs
    let public_input_0_bird_y_position: u64 = unsafe { wasm_input(1) };
    let public_input_1_pipe_x_position: u64 = unsafe { wasm_input(1) };
    let public_input_2_highscore: u64 = unsafe { wasm_input(1) };
    let public_input_3_player_highscore: u64 = unsafe { wasm_input(1) };

    SpinGame::initialize_game(SpinGameInitArgs {
        bird_y_position: public_input_0_bird_y_position,
        pipe_x_position: public_input_1_pipe_x_position,
        highscore: public_input_2_highscore,
        player_highscore: public_input_3_player_highscore
    });

    // specify the private inputs
    let private_inputs_length = unsafe { wasm_input(0) };

    for _i in 0..private_inputs_length {
        let private_input = unsafe { wasm_input(0) };
        SpinGame::step(private_input);
    }

    unsafe {
        let final_game_state: SpinGameIntermediateStates = SpinGame::get_game_state();
        zkwasm_rust_sdk::dbg!("final_game_state: {}\n", final_game_state);

        // specify the output
        wasm_output(final_game_state.bird_y_position as u64);
        wasm_output(final_game_state.pipe_x_position as u64);
        wasm_output(final_game_state.highscore as u64);
        wasm_output(final_game_state.player_highscore as u64);
    }

    0
}
