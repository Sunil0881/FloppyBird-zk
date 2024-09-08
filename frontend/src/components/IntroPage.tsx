import React from 'react';
import './IntroPage.css';

interface IntroPageProps {
  onStart: () => void;  // Prop to handle the Play Game button click
}

const IntroPage: React.FC<IntroPageProps> = ({ onStart }) => {
  return (
    <div className="intro-container">
      <button className="play-button" onClick={onStart}>
        Play Game
      </button>
      <p>Powered by zkSpin</p>
    </div>
  );
};

export default IntroPage;
