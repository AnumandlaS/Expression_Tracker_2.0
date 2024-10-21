import "./App.css";
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your components
import Home from './components/Home';
import Analysis from './components/Analysis';
import Login from './components/Login'; 
import OverallAnalysis from './components/OverallAnalysis';
import DetailedAnalysis from './components/DetailedAnalysis';
import Game from './components/Game';

function App() {
  return (
    <BrowserRouter>
      <div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/game" element={<Game />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/analysis/:sessionId" element={<OverallAnalysis />} />
            <Route path="/DetailedAnalysis/:sessionId" element={<DetailedAnalysis/>}/>
          </Routes>
        </div>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
