// // GameSelection.js
// import './GameSelection.css';
// import React from 'react';
// import { useNavigate } from 'react-router-dom';


// const GameSelection = () => {
//   const navigate = useNavigate();

//   const goToGame1 = () => {
//     navigate('/login'); // Redirects to Game 1
//   };

//   const goToGame2 = () => {
//     navigate('/game_2'); // Redirects to Game 2
//   };

//   return (
//     <div>
//       <h2>Select a Game</h2>
//       <button onClick={goToGame1}>Game 1</button>
//       <button onClick={goToGame2}>Game 2</button>
//     </div>
//   );
// };

// export default GameSelection;
// GameSelection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameSelection.css';

const GameSelection = () => {
  const navigate = useNavigate();

  const handleGame1Click = () => {
    navigate('/login?redirect=Game');
  };

  const handleGame2Click = () => {
    navigate('/game_2');
  };

  return (
    <div className="game-selection-container">
      <h2>Select a Game</h2>
      <button className="game-button" onClick={handleGame1Click}>Game 1</button>
      <button className="game-button" onClick={handleGame2Click}>Game 2</button>
    </div>
  );
};

export default GameSelection;
