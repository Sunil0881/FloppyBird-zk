use crate::definition::SpinGameIntermediateStates;
use crate::spin::SpinGameTrait;
use once_cell::sync::Lazy;
use std::sync::Mutex;

pub const MAX_Y_POSITION: u64 = 10;
pub const MIN_Y_POSITION: u64 = 0;
pub const PIPE_GAP: u64 = 3;
pub const PIPE_SPEED: u64 = 1;
pub const GRAVITY: u64 = 1;

pub static GAME_STATE: Lazy<Mutex<SpinGameIntermediateStates>> =
    Lazy::new(|| Mutex::new(SpinGameIntermediateStates::new()));

// Gameplay logic for Flappy Bird-style game
pub struct Game;

impl Game {
    pub fn initialize_game(y_position: u64, pipe_x_position: u64, pipe_gap_start: u64, highscore: u64) {
        let mut game_state = GAME_STATE.lock().unwrap();
        game_state.y_position = y_position;
        game_state.pipe_x_position = pipe_x_position;
        game_state.pipe_gap_start = pipe_gap_start;
        game_state.highscore = highscore;
        game_state.is_game_over = false;
    }

    pub fn step_bird(input: u64) {
        let mut game_state = GAME_STATE.lock().unwrap();
        if game_state.is_game_over {
            panic!("Game over. Please restart.");
        }

        // Apply gravity to the bird's movement
        game_state.y_position = game_state.y_position.saturating_sub(GRAVITY);

        // Bird movement: Player input (flap)
        if input == 0 {
            game_state.y_position += 1;
        }

        // Move the pipes
        game_state.pipe_x_position = game_state.pipe_x_position.saturating_sub(PIPE_SPEED);
        if game_state.pipe_x_position == 0 {
            game_state.pipe_x_position = MAX_Y_POSITION;
            game_state.pipe_gap_start = rand::random::<u64>() % (MAX_Y_POSITION - PIPE_GAP);
            game_state.highscore += 1; // Increment score for passing a pipe
        }

        // Check collisions (bird hits ground or pipe)
        if game_state.y_position <= MIN_Y_POSITION || game_state.y_position >= MAX_Y_POSITION {
            game_state.is_game_over = true; // Bird hit the ground or flew too high
        } else if game_state.pipe_x_position == 1
            && (game_state.y_position < game_state.pipe_gap_start
                || game_state.y_position > game_state.pipe_gap_start + PIPE_GAP)
        {
            game_state.is_game_over = true; // Bird hit the pipe
        }
    }

    pub fn get_state() -> SpinGameIntermediateStates {
        let game_state = GAME_STATE.lock().unwrap().clone();
        game_state
    }
}
