import React, { useEffect, useRef, useState } from 'react'
import Bird from './Bird'
import ForeGround from './ForeGround'
import Pipe from './Pipe'
import { useDispatch, useSelector } from 'react-redux'
import { addScore, gameOver, start } from '../Redux/gameReducer'
import { fly, fall, birdReset } from '../Redux/birdReducer'
import { generatePipe, pipeReset, pipeRun } from '../Redux/pipeReducer'

let gameLoop
let pipeGenerator

export default function Game() {
    
    const dispatch = useDispatch()
    const { game } = useSelector((state) => state.game)
    const { bird } = useSelector((state) => state.bird)
    const { pipes, startPosition } = useSelector((state) => state.pipe)
    const wingRef = useRef(null)
    const hitRef = useRef(null)
    const pointRef = useRef(null)

    // State to store the high score fetched from the backend
    const [highScore, setHighScore] = useState(0)

    // Fetch high score from the server when the component mounts
    useEffect(() => {
        fetch('http://localhost:5000/highscore')
            .then(response => response.json())
            .then(data => {
                setHighScore(data.highScore)
            })
            .catch(error => console.error('Error fetching high score:', error))
    }, [])

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
                fetch('http://localhost:5000/highscore', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ score: game.score })
                })
                .then(response => response.json())
                .then(data => {
                    setHighScore(data.highScore) // Update the displayed high score
                })
                .catch(error => console.error('Error updating high score:', error))
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
