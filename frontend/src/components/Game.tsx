import React, { useEffect, useRef, useState } from 'react'
import Bird from './Bird'
import ForeGround from './ForeGround'
import Pipe from './Pipe'
import { useDispatch, useSelector } from 'react-redux'
import { addScore, gameOver, start } from '../Redux/gameReducer'
import { fly, fall, birdReset } from '../Redux/birdReducer'
import { generatePipe, pipeReset, pipeRun } from '../Redux/pipeReducer'

import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { abi } from "../ABI.json";
import { config } from "../web3";
import { readContract } from "wagmi/actions";
import { TaskStatus } from "zkwasm-service-helper";
import { Spin, SpinGameInitArgs } from "spin";
import { useAccount } from 'wagmi';


const GAME_CONTRACT_ADDRESS = import.meta.env.VITE_GAME_CONTRACT_ADDRESS;
const ZK_USER_ADDRESS = import.meta.env.VITE_ZK_CLOUD_USER_ADDRESS;
const ZK_USER_PRIVATE_KEY = import.meta.env.VITE_ZK_CLOUD_USER_PRIVATE_KEY;
const ZK_IMAGE_MD5 = import.meta.env.VITE_ZK_CLOUD_IMAGE_MD5;
const ZK_CLOUD_RPC_URL = import.meta.env.VITE_ZK_CLOUD_URL;

interface GameState {
    x_position: bigint;
    y_position: bigint;
    highscore: bigint;
    player_highscore: bigint;
}

let gameLoop: NodeJS.Timeout;
let pipeGenerator: NodeJS.Timeout;
let spin: Spin;

async function verify_onchain({
    proof,
    verify_instance,
    aux,
    instances,
}: {
    proof: BigInt[];
    verify_instance: BigInt[];
    aux: BigInt[];
    instances: BigInt[];
    status: TaskStatus;
}) {
    console.log("proof", proof);
    console.log("verify_instance", verify_instance);
    console.log("aux",aux);

    console.log("instance val passed", [instances]);
    
    const result = await writeContract(config, {
        abi,
        address: GAME_CONTRACT_ADDRESS,
        functionName: "settleProof",
        args: [proof, verify_instance, aux, [instances]],
    });
    const transactionReceipt = waitForTransactionReceipt(config, {
        hash: result,
    });
    return transactionReceipt;
}

/* This function is used to get the on-chain game states */
async function getOnchainGameStates() {
    const result = (await readContract(config, {
        abi,
        address: GAME_CONTRACT_ADDRESS,
        functionName: "getStates",
        args: [],
    })) as [bigint, bigint, bigint, any];
    return result;
}


export default function Game() {

    const {isConnected} = useAccount()
    useEffect(() => {
if(!isConnected){
  console.log("not connected");
  
  return
}
        getOnchainGameStates().then(async (result): Promise<any> => {
            const x_position = result[0];
            const y_position = result[1];
            const highscore = result[2];
            const player_highscore = result[3];

           
            setOnChainGameStates({
                x_position,
                y_position,
                highscore,
                player_highscore
            });

            spin = new Spin({
                cloudCredentials: {
                    CLOUD_RPC_URL: ZK_CLOUD_RPC_URL,
                    USER_ADDRESS: ZK_USER_ADDRESS,
                    USER_PRIVATE_KEY: ZK_USER_PRIVATE_KEY,
                    IMAGE_HASH: ZK_IMAGE_MD5,
                },  
            });

           
            
            spin.initialize_import().then(() => {
                const arg = new SpinGameInitArgs( x_position,
                    y_position,
                    highscore,
                    player_highscore);
                console.log("arg = ", arg);
                spin.initialize_game(arg);
                updateDisplay();
            });
        });
    }, []);


    const [gameState, setGameState] = useState<GameState>({
        x_position: BigInt(0),
        y_position: BigInt(0),
        highscore: BigInt(0),
        player_highscore: BigInt(0)
    });

   
    

    const [onChainGameStates, setOnChainGameStates] = useState<GameState>({
        x_position: BigInt(0),
        y_position: BigInt(0),
        highscore: BigInt(0),
        player_highscore: BigInt(0),

    });

    console.log("onchainStates", onChainGameStates);
    

    const [moves, setMoves] = useState<bigint[]>([]);
console.log("moves",moves);


const onClick = (command: bigint) => () => {
    spin.step(command);
    updateDisplay();
};

const updateDisplay = () => {
    const newGameState = spin.getGameState();
    setGameState({
        x_position: newGameState.x_position,
        y_position: newGameState.y_position,
        highscore: newGameState.highscore,
        player_highscore: newGameState.player_highscore,
    });
    setMoves(spin.witness);
};


const submitProof = async () => {
    console.log("valleded");
    
    const proof = await spin.generateProof();
console.log("proof",proof);

    if (!proof) {
        console.error("Proof generation failed");
        return;
    }
    // onchain verification operations
    console.log("submitting proof");
try {
const verificationResult = await verify_onchain(proof);

console.log("verificationResult = ", verificationResult);
} catch (error) {
console.log("error in verify onchain function", error);

}

    // wait for the transaction to be broadcasted, better way is to use event listener
    await new Promise((r) => setTimeout(r, 1000));

    const gameStates = await getOnchainGameStates();

    setOnChainGameStates({
        x_position: gameStates[0],
        y_position: gameStates[1],
        highscore: gameStates[2],
        player_highscore: gameStates[3]
    });

    await spin.reset();
    
};



    
    const dispatch = useDispatch()
    const { game } = useSelector((state: any) => state.game);
    const { bird } = useSelector((state: any) => state.bird);
    const { pipes, startPosition } = useSelector((state: any) => state.pipe);
    const wingRef = useRef(null)
    const hitRef = useRef(null)
    const pointRef = useRef(null)

   
    const [highScore, setHighScore] = useState(0)

 
    function startGameLoop() {
        gameLoop = setInterval(() => {
            dispatch(fall())
            dispatch(pipeRun())
        }, 150)
        
        pipeGenerator = setInterval(() => {
            dispatch(generatePipe()) 
            dispatch(addScore())
            pointRef.current.play()
        }, 3000)
    }

    function stopGameLoop() {
        clearInterval(gameLoop)
        clearInterval(pipeGenerator)
    }

    const handleClick = (e) => {
        if (game.status === 'PLAYING') {
            dispatch(fly())
            const commandValue = BigInt(0);
            onClick(commandValue);

        }
    }

    const newGameHandler = () => {
        startGameLoop()
        dispatch(start())
    }

    useEffect(() => {
        if (game.status === 'GAME_OVER') {
            stopGameLoop()

            // If the player beats the high score, send the new score to the server
            if (game.score > highScore) {
             
                    setHighScore(highScore) // Update the displayed high score
               
            }
        } else {
            const x = startPosition.x

            const challenge = pipes
              .map(({height}, i) => {
                return {
                  x1: x + i * 200,
                  y1: height,
                  x2: x + i * 200,
                  y2: height + 100,
                }
              })
              .filter(({x1}) => x1 > 0 && x1 < 288)

            if (bird.y > 512 - 108) {
              dispatch(gameOver())
              const commandValuee = BigInt(0);
              onClick(commandValuee);
              submitProof();
              dispatch(birdReset())
              dispatch(pipeReset())
              hitRef.current.play()
            }
          
            if (challenge.length) {
              const {x1, y1, x2, y2} = challenge[0]
              if (
                (x1 < 150 && 150 < x1 + 52 && bird.y < y1) ||
                (x2 < 150 && 150 < x2 + 52 && bird.y > y2)
              ) {
                hitRef.current.play()
                dispatch(gameOver())
                const commandValuee = BigInt(0);
                onClick(commandValuee);
                submitProof();
                dispatch(birdReset())
                dispatch(pipeReset())
              }
            }
        }
    }, [startPosition.x])

    return (
        <div className='game-div' onClick={handleClick}>
            <audio ref={hitRef} src="./hit.mp3"></audio>
            <audio ref={pointRef} src="./point.mp3"></audio>
            <h2 style={{position: 'absolute', top: 4, left: 70}}>High Score: {highScore}</h2> {/* Display high score */}
            {game.status === 'NEW_GAME' && (
              <>
                <img className='start-btn' src="./start-button.png" onClick={newGameHandler} alt="" />
                <Bird />
              </>
            )}
            {game.status === 'GAME_OVER' && (
                <>
                    <img className='start-btn' src="./start-button.png" onClick={newGameHandler} alt="" />
                    <h2 style={{position: 'absolute', top: 100, left: 80}}>Game Over</h2>  
                    <h2 style={{position: 'absolute', top: 150, left: 140}}>{game.score}</h2>  
                </>
            )}
            {game.status === 'PLAYING' && (
                <>
                    <audio ref={wingRef} src="./wing.mp3"></audio>
                    <Bird />
                    <Pipe />
                    <ForeGround />
                    <h2 style={{position: 'absolute', top: 50, left: 150}}>{game.score}</h2>  
                </>
            )}
        </div>
    )
}

//nobug