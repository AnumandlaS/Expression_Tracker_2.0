// // // /*new code*/
// // // Import the CSS file for styling the application
// // import "./App.css";

// // // Import React library for building components
// // import React from 'react';

// // // Import routing components from react-router-dom
// // import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// // // Import custom components for different parts of the application
// // import Footer from "./components/Footer";
// // import Home from './components/Home';
// // import Game from './components/Game';
// // import Analysis from './components/Analysis';
// // import UploadForm from './components/UploadForm'; // Assuming this is your upload form
// // import SessionDetails from './components/SessionDetails'; // Import the new SessionDetails component

// // // Define the main App component
// // function App() {
// //   return (
// //     // Wrap the application in Router to enable routing
// //     <Router>
// //       <div>
// //         {/* Container for the main content */}
// //         <div className="content">
// //           {/* Define routing for different paths */}
// //           <Routes>
// //             {/* Render Home component for the root path */}
// //             <Route path="/" element={<Home />} />
// //             {/* Render Game component for the /game path */}
// //             <Route path="/game" element={<Game />} />
// //             {/* Render Analysis component for the /analysis path */}
// //             <Route path="/analysis" element={<Analysis />} />
// //             {/* Render UploadForm component for the /upload path */}
// //             <Route path="/upload" element={<UploadForm />} /> 
// //             {/* New route for session details */}
// //             <Route path="/session/:sessionId" element={<SessionDetails />} /> 
// //           </Routes>
// //         </div>
// //         {/* Footer component displayed on all pages */}
// //         <Footer />
// //       </div>
// //     </Router>
// //   );
// // }

// // // Export the App component for use in other parts of the application
// // export default App;
// import "./App.css";
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Footer from "./components/Footer";
// import Home from './components/Home';
// import Game from './components/Game';
// import Analysis from './components/Analysis';
// import Login from './components/Login'; // Import Login component

// function App() {
//   return (
//     <Router>
//       <div>
//         <div className="content">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} /> {/* New Login Route */}
//             <Route path="/game" element={<Game />} />
//             <Route path="/analysis" element={<Analysis />} />
//           </Routes>
//         </div>
//         <Footer/>
//       </div>
//     </Router>
//   );
// }

// export default App;
import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from "./components/Footer";
import Home from './components/Home';
import Game from './components/Game';
import Analysis from './components/Analysis';
import Login from './components/Login'; // Import Login component
import OverallAnalysis  from './components/OverallAnalysis';
function App() {
  return (
    <Router>
      <div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} /> {/* New Login Route */}
            <Route path="/game" element={<Game />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/Analysis/:sessionId" element={<OverallAnalysis/>}/>
          </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
