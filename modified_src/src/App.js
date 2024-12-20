// import "./App.css";
// import React from 'react';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // Import your components
// import Home from './components/Home';
// import Analysis from './components/Analysis';
// import Login from './components/Login'; 
// import OverallAnalysis from './components/OverallAnalysis';
// import DetailedAnalysis from './components/DetailedAnalysis';
// import Game from './components/Game';

// function App() {
//   return (
//     <BrowserRouter>
//       <div>
//         <div className="content">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/game" element={<Game />} />
//             <Route path="/analysis" element={<Analysis />} />
//             <Route path="/analysis/:sessionId" element={<OverallAnalysis />} />
//             <Route path="/DetailedAnalysis/:sessionId" element={<DetailedAnalysis/>}/>
//           </Routes>
//         </div>
//         {/* <Footer /> */}
//       </div>
//     </BrowserRouter>
//   );
// }

// // // export default App;
// import "./App.css";
// import React from 'react';
// import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // Import your components
// import Home from './components/Home';
// import Analysis from './components/Analysis';
// import Login from './components/Login'; 
// import OverallAnalysis from './components/OverallAnalysis';
// import DetailedAnalysis from './components/DetailedAnalysis';
// import Game from './components/Game';

// const Main = () => {
//   const location = useLocation();

//   // Determine which background class to apply
//   const backgroundClass = location.pathname === '/' || location.pathname === '/game' 
//                           ? 'full-background' 
//                           : 'analysis-background';

//   return (
//     <div className={backgroundClass}>
//       <div className="content">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/game" element={<Game />} />
//           <Route path="/analysis" element={<Analysis />} />
//           <Route path="/analysis/:sessionId" element={<OverallAnalysis />} />
//           <Route path="/DetailedAnalysis/:sessionId" element={<DetailedAnalysis />} />
//         </Routes>
//       </div>
//       {/* <Footer /> */}
//     </div>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Main />
//     </BrowserRouter>
//   );
// }

// export default App;

import "./App.css";
import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your components
import Home from './components/Home';
import Analysis from './components/Analysis';
import Login from './components/Login'; 
import OverallAnalysis from './components/OverallAnalysis';
import DetailedAnalysis from './components/DetailedAnalysis';
import Game from './components/Game';

const Main = () => {
  const location = useLocation();

  // Determine which background class to apply
  let backgroundClass = 'no-background'; // Default background class

  if (location.pathname === '/') {
    backgroundClass = 'full-background'; // Home page background
  } else if (location.pathname === '/game') {
    backgroundClass = 'full-background'; // Game page background
  } else if(location.pathname==='/login')
  {
    backgroundClass = 'full-background';
  }
  else if (location.pathname === '/analysis' || location.pathname.startsWith('/analysis/')) {
    backgroundClass = 'analysis-background'; // Analysis page background
  }
  else if (location.pathname.startsWith('/DetailedAnalysis/')) {
    backgroundClass = 'analysis-background'; // Analysis page background
  }

  

  return (
    <div className={backgroundClass}>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={<Game />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/analysis/:sessionId" element={<OverallAnalysis />} />
          <Route path="/DetailedAnalysis/:sessionId" element={<DetailedAnalysis />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default App;
