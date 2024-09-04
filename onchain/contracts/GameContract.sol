// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SpinContract.sol";

contract GameContract is SpinContract {
    /* Trustless Application Settlement Template */
    constructor(address verifier_address) SpinContract(verifier_address) {}

    /* Application On-chain Business Logic */

    // Mapping to store the current game score and high score for each user
    mapping(address => uint64) public gameScores;        // Maps user's address to their current game score
    mapping(address => uint64) public playerHighScores;  // Maps user's address to their highest score

    // Global high score across all players
    uint64 public globalHighScore;

    // Get the current state of both game and player high score for the caller (msg.sender) along with the global high score
    function getAllScores() external view returns (uint64 gameScore, uint64 playerHighScore, uint64 globalHighScoreResult) {
        return (
            gameScores[msg.sender],         // The caller's current game score
            playerHighScores[msg.sender],   // The caller's high score
            globalHighScore                 // The global high score across all players
        );
    }

    struct ZKInput {
        uint64 start_gameScore;
        uint64 start_playerHighScore;
        uint64 start_globalHighScore;
    }

    struct ZKOutput {
        uint64 end_gameScore;
        uint64 end_playerHighScore;
        uint64 end_globalHighScore;
    }

    // Override the settle function from SpinContract
    function settle(uint256[][] calldata instances) internal override {
        address user = msg.sender;

        ZKInput memory zk_input = ZKInput(
            uint64(instances[0][0]),  // start_gameScore
            uint64(instances[0][1]),  // start_playerHighScore
            uint64(instances[0][2])   // start_globalHighScore
        );

        ZKOutput memory zk_output = ZKOutput(
            uint64(instances[0][3]),  // end_gameScore
            uint64(instances[0][4]),  // end_playerHighScore
            uint64(instances[0][5])   // end_globalHighScore
        );

        // Validate that the current game score matches the user's stored game score
        require(
            zk_input.start_gameScore == gameScores[user],
            "Invalid game score start state"
        );
        // Validate that the player's high score matches the stored player high score
        require(
            zk_input.start_playerHighScore == playerHighScores[user],
            "Invalid player highscore start state"
        );
        // Validate that the global high score matches the current stored global high score
        require(
            zk_input.start_globalHighScore == globalHighScore,
            "Invalid global highscore start state"
        );

        // Update the user's game score
        gameScores[user] = zk_output.end_gameScore;

        // Update the player's high score if they beat their previous high score
        if (zk_output.end_playerHighScore > playerHighScores[user]) {
            playerHighScores[user] = zk_output.end_playerHighScore;
        }

        // Update the global high score if the player's new high score beats the global high score
        if (zk_output.end_globalHighScore > globalHighScore) {
            globalHighScore = zk_output.end_globalHighScore;
        }
    }

    // Developer-only function to manually set the game score for a user.
    function DEV_ONLY_setGameScore(address user, uint64 _gameScore) external onlyOwner {
        gameScores[user] = _gameScore;
    }

    // Developer-only function to manually set the player high score for a user.
    function DEV_ONLY_setPlayerHighScore(address user, uint64 _playerHighScore) external onlyOwner {
        playerHighScores[user] = _playerHighScore;
    }

    // Developer-only function to manually set the global high score.
    function DEV_ONLY_setGlobalHighScore(uint64 _globalHighScore) external onlyOwner {
        globalHighScore = _globalHighScore;
    }
}
