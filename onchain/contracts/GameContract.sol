// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SpinContract.sol";

contract GameContract is SpinContract {
    /* Trustless Application Settlement Template */
    constructor(address verifier_address) SpinContract(verifier_address) {}

    /* Application On-chain Business Logic */
    uint64 public bird_y_position;
    uint64 public pipe_x_position;
    uint64 public highscore;
    mapping (address => uint) public playerHighScore;

    // Get the current state of the game contract
    function getStates() external view returns (uint64, uint64, uint64, uint) {
        uint playerScore = playerHighScore[msg.sender];
        return (bird_y_position, pipe_x_position, highscore, playerScore);
    }

    struct ZKInput {
        uint64 start_bird_y_position;
        uint64 start_pipe_x_position;
        uint64 start_highscore;
        uint start_playerHighScore;
    }

    struct ZKOutput {
        uint64 end_bird_y_position;
        uint64 end_pipe_x_position;
        uint64 end_highscore;
        uint end_playerHighScore;
    }

    // Settle a verified proof
    function settle(uint256[][] calldata instances) internal override {
        ZKInput memory zk_input = ZKInput(
            uint64(instances[0][0]), 
            uint64(instances[0][1]), 
            uint64(instances[0][2]), 
            uint(instances[0][3])
        );

        ZKOutput memory zk_output = ZKOutput(
            uint64(instances[0][4]), 
            uint64(instances[0][5]), 
            uint64(instances[0][6]), 
            uint(instances[0][7])
        );

        require(
            zk_input.start_bird_y_position == bird_y_position &&
            zk_input.start_pipe_x_position == pipe_x_position &&
            zk_input.start_highscore == highscore &&
            zk_input.start_playerHighScore == playerHighScore[msg.sender],
            "Invalid start state"
        );

        bird_y_position = zk_output.end_bird_y_position;
        pipe_x_position = zk_output.end_pipe_x_position;
        highscore = zk_output.end_highscore;
        playerHighScore[msg.sender] = zk_output.end_playerHighScore;
    }

    function DEV_ONLY_setStates(uint64 _bird_y_position, uint64 _pipe_x_position, uint64 _highscore, uint _playerHighscore) external onlyOwner {
        bird_y_position = _bird_y_position;
        pipe_x_position = _pipe_x_position;
        highscore = _highscore;
        playerHighScore[msg.sender] = _playerHighscore;
    }
}
