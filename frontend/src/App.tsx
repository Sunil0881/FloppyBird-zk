import React, { useEffect, useState } from 'react';
import './App.css';
import Game from './components/Game';
import { waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { abi } from './ABI.json';
import { config } from './web3';
import { readContract } from 'wagmi/actions';
import { Spin } from 'spin';
import { TaskStatus } from 'zkwasm-service-helper';

const GAME_CONTRACT_ADDRESS = import.meta.env.VITE_GAME_CONTRACT_ADDRESS;
const ZK_USER_ADDRESS = import.meta.env.VITE_ZK_CLOUD_USER_ADDRESS;
const ZK_USER_PRIVATE_KEY = import.meta.env.VITE_ZK_CLOUD_USER_PRIVATE_KEY;
const ZK_IMAGE_MD5 = import.meta.env.VITE_ZK_CLOUD_IMAGE_MD5;
const ZK_CLOUD_RPC_URL = import.meta.env.VITE_ZK_CLOUD_URL;

interface GameState {
  y_position: number;
  pipe_x_position: number;
  pipe_gap_start: number;
}

let spin: Spin;

const App: React.FC = () => {
  const [highScore, setHighScore] = useState<string>('0');
  const [gameState, setGameState] = useState<GameState>({
    y_position: 0,
    pipe_x_position: 0,
    pipe_gap_start: 0,
  });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(0);

  // Fetch on-chain game state
  useEffect(() => {
    async function fetchHighScore() {
        try {
          // Ensure that chainId and provider are set properly in the config object
          const { chainId, provider } = config;
      
          if (!chainId || !provider) {
            throw new Error('Missing chainId or provider in configuration.');
          }
      
          const result = await readContract({
            abi,
            address: GAME_CONTRACT_ADDRESS,
            functionName: 'getGlobalHighScore',
            chainId,  // Add chainId here
            signerOrProvider: provider,  // Ensure the provider is passed here
          }) as bigint;
      
          setHighScore(result.toString());
        } catch (error) {
          console.error('Error fetching high score from contract:', error);
        }
      }
      

    fetchHighScore();
  }, []);

  // Submit the proof to the chain
  const submitProof = async () => {
    try {
      const proof = await spin.generateProof();

      if (!proof) {
        console.error('Proof generation failed');
        return;
      }

      const result = await writeContract(config, {
        abi,
        address: GAME_CONTRACT_ADDRESS,
        functionName: 'settleProof',
        args: [proof.proof, proof.verify_instance, proof.aux, [proof.instances]],
      });

      const transactionReceipt = await waitForTransactionReceipt({ hash: result });
      console.log('Transaction confirmed:', transactionReceipt);
    } catch (error) {
      console.error('Error submitting proof to blockchain:', error);
    }
  };

  // Initialize the game on-chain
  useEffect(() => {
    async function initializeSpinGame() {
      spin = new Spin({
        cloudCredentials: {
          CLOUD_RPC_URL: ZK_CLOUD_RPC_URL,
          USER_ADDRESS: ZK_USER_ADDRESS,
          USER_PRIVATE_KEY: ZK_USER_PRIVATE_KEY,
          IMAGE_HASH: ZK_IMAGE_MD5,
        },
      });

      await spin.initialize_import();

      // Initialize game state with starting values
      setGameState({
        y_position: 5,
        pipe_x_position: 10,
        pipe_gap_start: 3,
      });

      setIsGameOver(false);
      setCurrentScore(0);
    }

    initializeSpinGame();
  }, []);

  const onClick = async (input: number) => {
    try {
      spin.step_bird(input); // Use on-chain logic when a player moves

      // Fetch the updated game state after each step
      const updatedState = await spin.get_state();

      setGameState({
        y_position: updatedState.y_position,
        pipe_x_position: updatedState.pipe_x_position,
        pipe_gap_start: updatedState.pipe_gap_start,
      });

      // If the game is over, set the game over state and submit proof
      if (updatedState.is_game_over) {
        setIsGameOver(true);
        await submitProof();
        console.log('Game over! Submitting proof...');
      } else {
        setCurrentScore((prevScore) => prevScore + 1);
      }
    } catch (error) {
      console.error('Error during game step:', error);
    }
  };

  return (
    <div className="App">
       <w3m-button></w3m-button>
      {/* <header>
        <h1>Flappy Bird Game</h1>
        <p>Current High Score: {highScore}</p>
        <p>Your Score: {currentScore}</p>
        {isGameOver ? <p>Game Over! Please refresh to restart.</p> : null}
      </header> */}
      <Game onClick={onClick} submitProof={submitProof} highScore={highScore} />
    </div>
  );
};

export default App;
