import "./App.css";
import React,{ useState} from 'react';
import { BrowserRouter, Route, Routes, useLocation ,Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your components
import Home from './components/Home';
import Analysis from './components/Analysis';
import Login from './components/Login'; 
import OverallAnalysis from './components/OverallAnalysis';
import DetailedAnalysis from './components/DetailedAnalysis';
import Game from './components/Game';
import LoginSignUp from "./components/loginSignUp";
import Login1 from "./components/Login1";
import Signup from "./components/Signup";

const Main = () => {
  const location = useLocation();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [action, setAction] = useState(null); // Track if 'Play' or 'Get Analysis' was clicked
  
  //  // Function to handle login success
  //  const handleLoginSuccess = () => {
  //   console.log("Login success. Setting isAuthenticated to true.");
  //   setIsAuthenticated(true);
  // };

  let backgroundClass = 'no-background'; // Default background class

  if (location.pathname === '/') {
    backgroundClass = 'full-background'; // Home page background
  } //else if (location.pathname === '/game') {
    //backgroundClass = 'full-background'; } // Game page background
    else if(location.pathname==='/login')
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
          <Route path="/" element={<Login1/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={<Game />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/analysis/:sessionId" element={<OverallAnalysis />} />
          <Route path="/DetailedAnalysis/:sessionId" element={<DetailedAnalysis />} />
          {/* <Route path="/adminlogin" element={<Login1 onLoginSuccess={handleLoginSuccess} />} /> */}
          <Route path="/adminlogin" element={<Login1 />} /> 
          <Route path="/signup" element = {<Signup />}/>
          {/* <Route
            path="/analysis"
            element={isAuthenticated ? <Analysis /> : <Navigate to="/adminlogin" />} // Protected route
          /> */}
        </Routes>
      </div>
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