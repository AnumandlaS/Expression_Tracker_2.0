// Game_2.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Confetti from 'react-confetti';
import './Game.css';

const wordsData = [
  { word: "App_e", image: "images_2/apple.png", correctLetter: "l", options: ["s", "l", "k", "j"] },
  { word: "_at", image: "images_2/bat.avif", correctLetter: "b", options: ["d", "p", "b", "q"] },
  { word: "Do_", image: "images_2/dog.jpg", correctLetter: "g", options: ["g", "d", "b", "p"] },
  { word:"_at" , image:"images_2/cat.jpg.crdownload" , correctLetter: "c" ,options:["k","a" ,"c","b"]}
  // Add more levels if needed
];

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [completedWord, setCompletedWord] = useState(wordsData[currentLevel].word);
  const [showEndScreen, setShowEndScreen] = useState(false); // Controls the end screen

  const handleDrop = (letter) => {
    const { correctLetter, word } = wordsData[currentLevel];
    if (letter === correctLetter) {
      setIsCorrect(true);
      setCompletedWord(word.replace('_', letter));

      // Move to the next level after a delay
      setTimeout(() => {
        if (currentLevel < wordsData.length - 1) {
          setCurrentLevel(currentLevel + 1);
          setCompletedWord(wordsData[currentLevel + 1].word);
          setIsCorrect(null);
        } else {
          setShowEndScreen(true); // Show end screen when all levels are completed
        }
      }, 1000);
    } else {
      setIsCorrect(false);
    }
  };

  if (showEndScreen) {
    return <EndScreen />;
  }

  const { image, options } = wordsData[currentLevel];

  return (
    <div className="game container text-center mt-5 p-3">
      <h3 className="mb-4 display-4" style={{ fontFamily: 'Comic Sans MS, sans-serif' }}>Fill the Missing Letter</h3>
      <WordWithImage word={completedWord} image={image} isCorrect={isCorrect} handleDrop={handleDrop} />
      <div className="options d-flex justify-content-center mt-4">
        {options.map((letter, index) => (
          <LetterOption key={index} letter={letter} />
        ))}
      </div>
    </div>
  );
};

const WordWithImage = ({ word, image, isCorrect, handleDrop }) => {
  const getBackgroundColor = () => {
    if (isCorrect === null) return 'white';
    return isCorrect ? 'lightgreen' : 'lightcoral';
  };

  const onDrop = (e) => {
    e.preventDefault();
    const droppedLetter = e.dataTransfer.getData("letter");
    handleDrop(droppedLetter);
  };

  return (
    <div
      className="word-container p-4 mb-3"
      style={{
        backgroundColor: getBackgroundColor(),
        borderRadius: '15px',
        transition: 'background-color 0.3s ease',
      }}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <img src={image} alt="object to guess" className="img-fluid mb-3 rounded" style={{ width: '150px' }} />
      <h1 className="display-3 font-weight-bold" style={{ fontFamily: 'Comic Sans MS, sans-serif', color: '#5a189a' }}>
        {word}
      </h1>
    </div>
  );
};

const LetterOption = ({ letter }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData("letter", letter);
  };

  return (
    <div
      className="letter-option btn btn-warning m-2"
      draggable
      onDragStart={onDragStart}
      style={{
        width: '50px',
        height: '50px',
        fontSize: '1.5rem',
        fontFamily: 'Comic Sans MS, sans-serif',
        color: '#FFFFFF',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {letter}
    </div>
  );
};

// End Screen component with confetti effect
const EndScreen = () => {
  return (
    <div className="end-screen text-center p-5">
      <Confetti />
      <h1 className="display-2 font-weight-bold" style={{ fontFamily: 'Comic Sans MS, sans-serif', color: '#4CAF50' }}>
        Well Done!
      </h1>
      <p className="lead" style={{ fontFamily: 'Comic Sans MS, sans-serif', color: '#555' }}>
        You've completed all the levels!
      </p>
    </div>
  );
};

export default Game;
