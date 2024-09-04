import React, { useEffect, useState } from 'react';
import './App.css';
import Game from './components/Game';
import { waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { abi } from './ABI.json';
import { config } from './web3';
import { readContract } from 'wagmi/actions';
import { Spin, SpinGameInitArgs } from 'spin';
import { TaskStatus } from 'zkwasm-service-helper';

const GAME_CONTRACT_ADDRESS = import.meta.env.VITE_GAME_CONTRACT_ADDRESS;
const ZK_USER_ADDRESS = import.meta.env.VITE_ZK_CLOUD_USER_ADDRESS;
const ZK_USER_PRIVATE_KEY = import.meta.env.VITE_ZK_CLOUD_USER_PRIVATE_KEY;
const ZK_IMAGE_MD5 = import.meta.env.VITE_ZK_CLOUD_IMAGE_MD5;
const ZK_CLOUD_RPC_URL = import.meta.env.VITE_ZK_CLOUD_URL;

interface GameState {
  total_steps: bigint;
  current_position: bigint;
}

let spin: Spin;

const App: React.FC = () => {
  const [highScore, setHighScore] = useState<string>('0');

  // Fetch on-chain game state
  useEffect(() => {
    async function fetchHighScore() {
      try {
        const result = await readContract({
          abi,
          address: GAME_CONTRACT_ADDRESS,
          functionName: 'getGlobalHighScore',
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
      const total_steps = 0n;
      const current_position = 0n;

      spin = new Spin({
        cloudCredentials: {
          CLOUD_RPC_URL: ZK_CLOUD_RPC_URL,
          USER_ADDRESS: ZK_USER_ADDRESS,
          USER_PRIVATE_KEY: ZK_USER_PRIVATE_KEY,
          IMAGE_HASH: ZK_IMAGE_MD5,
        },
      });

      await spin.initialize_import();
      const initArgs = new SpinGameInitArgs(total_steps, current_position);
      spin.initialize_game(initArgs);
    }

    initializeSpinGame();
  }, []);

  const onClick = (command: bigint) => {
    spin.step(command); // Use on-chain logic when a player moves
  };

  return (
    <div className="App">
      <Game onClick={onClick} submitProof={submitProof} highScore={highScore} />
    </div>
  );
};

export default App;
