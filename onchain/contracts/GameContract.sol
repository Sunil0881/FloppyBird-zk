// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SpinContract.sol";

contract GameContract is SpinContract {
    /* Trustless Application Settlement Template */
    constructor(address verifier_address) SpinContract(verifier_address) {}

    /* Application On-chain Business Logic */

    // Map the user's address to their game highscore and total highscore
    mapping(address => uint64) public gameHighscores;
    uint64 public totalHighscore;  // Global total highscore stored on-chain

    // Get the current state of both game and total highscore for the user
    function getStates(address user) external view returns (uint64, uint64) {
        return (gameHighscores[user], totalHighscore);
    }

    struct ZKInput {
        uint64 start_gameHighscore;
    }

    struct ZKOutput {
        uint64 end_gameHighscore;
        uint64 end_totalHighscore;
    }

    // Settle a verified proof  
    function settle(address user, uint256[][] calldata instances) internal override {
        ZKInput memory zk_input = ZKInput(
            uint64(instances[0][0])  // start_gameHighscore
        );

        ZKOutput memory zk_output = ZKOutput(
            uint64(instances[0][1]),  // end_gameHighscore
            uint64(instances[0][2])   // end_totalHighscore
        );

        require(
            zk_input.start_gameHighscore == gameHighscores[user],
            "Invalid game highscore start state"
        );

        // Update the user's game highscore
        gameHighscores[user] = zk_output.end_gameHighscore;

        // Update the global total highscore if the user's new highscore is higher
        if (zk_output.end_totalHighscore > totalHighscore) {
            totalHighscore = zk_output.end_totalHighscore;
        }
    }

    // Developer-only function to manually set the game highscore for a user.
    function DEV_ONLY_setGameHighscore(address user, uint64 _gameHighscore) external onlyOwner {
        gameHighscores[user] = _gameHighscore;
    }

    // Developer-only function to manually set the total highscore globally.
    function DEV_ONLY_setTotalHighscore(uint64 _totalHighscore) external onlyOwner {
        totalHighscore = _totalHighscore;
    }
}
