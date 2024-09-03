import { SpinGameInitArgs, SpinGameIntermediateStates } from "game_logic_esm/gameplay";
export interface GamePlayContructor {
    callback: () => void;
}
export declare class GamePlay {
    constructor();
    init(): Promise<void>;
    init_game(arg: SpinGameInitArgs): void;
    step(command: bigint): void;
    getGameState(): SpinGameIntermediateStates;
}
export { SpinGameInitArgs, SpinGameIntermediateStates };
