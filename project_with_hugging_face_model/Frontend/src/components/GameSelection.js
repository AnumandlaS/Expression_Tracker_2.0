
// // import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import '../styles/GameSelection.css';
// // import {useLocation } from 'react-router-dom';

// // const GameSelection = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { username } = location.state || {}; // Destructure `username` from state
// //   console.log("the username is : ",username);
// //   const games = [
// //     {
// //       id: 1,
// //       title: 'CRACK-THE-QUIZ',
// //       description: 'Answer simple quiz questions',
// //       image: 'images_2/quiz_game.png',
// //       onClick: () => navigate('/game',{state:{username}}),
// //     },
// //     {
// //       id: 2,
// //       title: 'FIND-MISSING-LETTERS',
// //       description: 'Drag the missing letter to the letter',
// //       image: 'images_2/missing_letter.png',
// //       onClick: () => navigate('/game_2',{state:{username}}),
// //     },
// //     // Add more games here if needed
// //   ];

// //   return (
// //     <div className="game-selection-container">
// //       <h2>Select a Game</h2>
// //       <div className="game-cards">
// //         {games.map((game) => (
// //           <div key={game.id} className="game-card" onClick={game.onClick}>
// //             <img src={game.image} alt={game.title} className="game-image" />
// //             <h3 className="game-title">{game.title}</h3>
// //             <p className="game-description">{game.description}</p>
// //           </div>
// //         ))}
// //       </div>
// //       <div>
// //         <br></br>
// //           <button className="btn" onClick={() => (window.location.href = "/")}>
// //             Home
// //           </button>
// //         </div>
// //       </div>
// //   );
// // };

// // export default GameSelection;

// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import '../styles/GameSelection.css';

// const GameSelection = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { username } = location.state || {}; // Destructure `username` from state

//   const handleLogout = () => {
//     // Add your logout logic here
//     console.log(`${username} logged out.`);
//     navigate('/'); // Redirect to the home or login page
//   };

//   const games = [
//     {
//       id: 1,
//       title: 'CRACK-THE-QUIZ',
//       description: 'Answer simple quiz questions',
//       image: 'images_2/quiz_game.png',
//       onClick: () => navigate('/game', { state: { username } }),
//     },
//     {
//       id: 2,
//       title: 'FIND-MISSING-LETTERS',
//       description: 'Drag the missing letter to the letter',
//       image: 'images_2/missing_letter.png',
//       onClick: () => navigate('/game_2', { state: { username } }),
//     },
//   ];

//   return (
//     <div>
      
//     <div className="game-selection-container">
//       {/* Top Navbar */}
//       <nav className="navbar navbar-expand-lg navbar-light fixed-top"  style={{
//         backgroundColor: 'rgba(173, 216, 230, 0.7)', // Pale white with 70% opacity
//         boxShadow: 'none',
//       }}>
//         <div className="container-fluid">
//           <a className="navbar-brand" href="/"  > <img src="favicon.ico" alt="Favicon" style={{ width: '50px',height:'50px', marginRight: '10px' }}/> <b>EXPRESSION TRACKER </b> </a>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//             aria-controls="navbarNav"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav">
//             <li className="nav-item">
//                 <a className="nav-link" href="/">Home</a>
//                 <button className="logout-btn" onClick={handleLogout}>
//             Logout ({username || 'Guest'})
//           </button>
//               </li>
//               {/* <li className="nav-item">
//                 <a className="nav-link" href="/about">About</a>
//               </li>
//               <li className="nav-item">
//                 <a className="nav-link" href="/learn-more">Learn More</a>
//               </li> */}
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <h2>Select a Game</h2>
//       <div className="game-cards">
//         {games.map((game) => (
//           <div key={game.id} className="game-card" onClick={game.onClick}>
//             <img src={game.image} alt={game.title} className="game-image" />
//             <h3 className="game-title">{game.title}</h3>
//             <p className="game-description">{game.description}</p>
//           </div>
//         ))}
//       </div>

//       {/* Home Button */}
//       <div>
//         <br />
//         <button className="btn" onClick={() => navigate('/')}>
//           Home
//         </button>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default GameSelection;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/GameSelection.css';

const GameSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {}; // Destructure `username` from state

  const handleLogout = () => {
    console.log(`${username} logged out.`);
    navigate('/'); // Redirect to the home or login page
  };

  const games = [
    {
      id: 1,
      title: 'CRACK-THE-QUIZ',
      description: 'Answer simple quiz questions',
      image: 'images_2/quiz_game.png',
      onClick: () => navigate('/game', { state: { username } }),
    },
    {
      id: 2,
      title: 'FIND-MISSING-LETTERS',
      description: 'Drag the missing letter to the letter',
      image: 'images_2/missing_letter.png',
      onClick: () => navigate('/game_2', { state: { username } }),
    },
  ];

  return (
    <div>
      <div className="game-selection-container">
        {/* Top Navbar */}
        <nav
          className="navbar navbar-expand-lg navbar-light fixed-top"
          style={{
            backgroundColor: 'rgba(173, 216, 230, 0.7)', // Pale white with 70% opacity
            boxShadow: 'none',
          }}
        >
          <div className="container-fluid">
            {/* Brand */}
            <a className="navbar-brand" href="/">
              <img
                src="favicon.ico"
                alt="Favicon"
                style={{ width: '50px', height: '50px', marginRight: '10px' }}
              />
              <b>EXPRESSION TRACKER</b>
            </a>

            {/* Toggle Button for Mobile */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Navbar Links */}
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                </li>
              </ul>

              {/* Logout Button */}
              <button
                className="btn logout-btn"
                onClick={handleLogout}
                style={{
                  marginLeft: 'auto',
                  backgroundColor: '#2ea8b1',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '5px',
                }}
              >
                Logout ({username || 'Guest'})
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
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

        {/* Home Button */}
        <div>
          <br />
          <button className="btn" onClick={() => navigate('/')}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
