import { configureStore } from "@reduxjs/toolkit";
import birdReducer from "./birdReducer";
import gameReducer from './gameReducer';
import pipeReducer from "./pipeReducer";

// Create the store
export const store = configureStore({
    reducer: {
        game: gameReducer,
        bird: birdReducer,
        pipe: pipeReducer,
    },
});

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;