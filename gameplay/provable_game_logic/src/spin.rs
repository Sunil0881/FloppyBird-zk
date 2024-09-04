use crate::definition::SpinGameInitArgs;
use crate::definition::SpinGameIntermediateStates;

pub trait SpinGameTrait {
    fn initialize_game(args: SpinGameInitArgs);
    fn step(input: u64, value: Option<u64>);
    fn get_game_state() -> SpinGameIntermediateStates;
}

pub struct SpinGame;

impl SpinGameTrait for SpinGame {
    fn initialize_game(args: SpinGameInitArgs) {
        // Initialize game logic
        Game::initialize_game(args.y_position, args.pipe_x_position, args.pipe_gap_start, args.highscore);
    }

    fn step(input: u64, _value: Option<u64>) {
        // Process a game step based on input
        Game::step_bird(input);
    }

    fn get_game_state() -> SpinGameIntermediateStates {
        // Return current game state
        Game::get_state()
    }
}
