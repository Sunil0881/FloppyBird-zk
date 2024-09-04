import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    game: {
        status: 'NEW_GAME',
        score: 0,
        highScore: 0,  // Initialize highScore in the state
    },
};

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        start: (state, action) => {
            state.game.status = 'PLAYING';
            state.game.score = 0;
        },
        gameOver: (state, action) => {
            state.game.status = 'GAME_OVER';

            // Update highScore if the current score is higher
            if (state.game.score > state.game.highScore) {
                state.game.highScore = state.game.score;
            }
        },
        newGame: (state, action) => {
            state.game.status = 'NEW_GAME';
            state.game.score = 0;
        },
        addScore: (state, action) => {
            state.game.score += 1;
        },
    },
});

export const { start, gameOver, newGame, addScore } = gameSlice.actions;

export default gameSlice.reducer;
