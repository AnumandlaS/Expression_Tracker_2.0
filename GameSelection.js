// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './GameSelection.css';

// const GameSelection = () => {
//   const navigate = useNavigate();

//   const handleGame1Click = () => {
//     navigate('/login?redirect=Game');
//   };

//   const handleGame2Click = () => {
//     navigate('/game_2');
//   };

//   return (
//     <div className="game-selection-container">
//       <h2>Select a Game</h2>
//       <button className="game-button" onClick={handleGame1Click}>Game 1</button>
//       <button className="game-button" onClick={handleGame2Click}>Game 2</button>
//     </div>
//   );
// };

// export default GameSelection;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameSelection.css';
import {useLocation } from 'react-router-dom';

const GameSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {}; // Destructure `username` from state
  console.log("the username is : ",username);
  const games = [
    {
      id: 1,
      title: 'CRACK-THE-QUIZ',
      description: 'Answer simple quiz questions',
      image: 'images_2/quiz_game.png',
      onClick: () => navigate('/game',{state:{username}}),
    },
    {
      id: 2,
      title: 'FIND-MISSING-LETTERS',
      description: 'Drag the missing letter to the letter',
      image: 'images_2/missing_letter.png',
      onClick: () => navigate('/game_2',{state:{username}}),
    },
    // Add more games here if needed
  ];

  return (
    <div className="game-selection-container">
      <h2>Select a Game</h2>
      <div className="game-cards">
        {games.map((game) => (
          <div key={game.id} className="game-card" onClick={game.onClick}>
            <img src={game.image} alt={game.title} className="game-image" />
            <h3 className="game-title">{game.title}</h3>
            <p className="game-description">{game.description}</p>
          </div>
        ))}
      </div>
      <div>
        <br></br>
          <button className="btn" onClick={() => (window.location.href = "/")}>
            Home
          </button>
        </div>
      </div>
  );
};

export default GameSelection;

