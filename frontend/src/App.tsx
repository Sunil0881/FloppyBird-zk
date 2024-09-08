import React, { useEffect, useRef, useState } from 'react';
import Game from './components/Game';
import IntroPage from './components/IntroPage';
import "./App.css";

const App: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);  // State to toggle between pages
  const audioRef = useRef<HTMLAudioElement>(null);  // Correct ref type for the audio element
  const [audioStarted, setAudioStarted] = useState(false);

  // Play the audio after any user interaction (click) on the page
  const startAudio = () => {
    if (audioRef.current && !audioStarted) {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed: ", error);
      });
      setAudioStarted(true);  // Prevent trying to play the audio again
    }
  };

  // Automatically play the audio when the app loads and the user interacts with the page
  useEffect(() => {
    document.addEventListener('click', startAudio);
    return () => {
      document.removeEventListener('click', startAudio);
    };
  }, [audioStarted]);

  const handleStartGame = () => {
    setIsGameStarted(true);  // Update state to start the game
  };

  return (
    <div className="App">
      {/* Audio element for background sound */}
      <audio ref={audioRef} src="/bgm.mp3" loop>
        Your browser does not support the audio element.
      </audio>

      {/* Conditionally render the Game or IntroPage based on the state */}
      {isGameStarted ? <Game /> : <IntroPage onStart={handleStartGame} />}
    </div>
  );
};

export default App;
