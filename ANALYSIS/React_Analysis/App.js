import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from "./components/Footer";
import Home from './components/Home';
import Game from './components/Game';
import Analysis from './components/Analysis';
import Login from './components/Login'; // Import Login component

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
          </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
