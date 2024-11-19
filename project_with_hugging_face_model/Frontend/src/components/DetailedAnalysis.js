import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/DetailedAnalysis.css';
import { useNavigate } from 'react-router-dom';
const ExpressionAnalysis = () => {
  const [sessionData, setSessionData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const { sessionId } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        console.log(1);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/detailed_sessions/${sessionId}`);
        console.log('Fetched session data:', response.data);
        setSessionData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching session data');
        setLoading(false);
      }
    };
    fetchSessionData();
  }, [sessionId]);

  useEffect(() => {
    if (sessionData) {
      console.log('Updated sessionData:', sessionData);
    }
  }, [sessionData]);

  const calculateHighestEmotion = (emotionArray) => {
    let highestEmotion = { label: '', score: 0 };

    emotionArray.forEach((emotionObject) => {
      if (emotionObject.score > highestEmotion.score) {
        highestEmotion = {
          label: emotionObject.label,
          score: emotionObject.score * 100, // Convert score to percentage
        };
      }
    });

    return highestEmotion;
  };

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="circular-loader"></div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!sessionData || !sessionData.imagePaths || !sessionData.screenshotPaths || !sessionData.modelResponse) {
    return <p>No data found for this session.</p>;
  }
  const handleAnalysisClick = () => {
    navigate('/analysis'); // Navigate to the home page
  };
  
  return (
    
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top"  style={{
        backgroundColor: 'rgba(173, 216, 230, 0.7)', // Pale white with 70% opacity
        boxShadow: 'none',
      }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="/"  > <img src="favicon.ico" alt="Favicon" style={{ width: '50px',height:'50px', marginRight: '10px' }}/> <b>EXPRESSION TRACKER </b> </a>
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
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
            <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
              {/* <li className="nav-item">
                <a className="nav-link" href="/about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/learn-more">Learn More</a>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
      
      <div className="image-strip-container">
      
      
        <h1>DETAILED ANALYSIS</h1>
        <div className="image-strip">
          {sessionData.imagePaths.map((imagePath, index) => {
            const emotions = sessionData.modelResponse[index];
            const highestEmotion = calculateHighestEmotion(emotions);
            const timestamp = (index + 1) * 10;

            return (
              <div key={index} className="image-box">
                <div className="time-percentage">
                  {highestEmotion.label}: {highestEmotion.score.toFixed(2)}% - Captured at {timestamp}s
                </div>
                <div className="image-container">
                  <img src={`${process.env.REACT_APP_BACKEND_URL}/${sessionData.screenshotPaths[index]}`} alt={`Screenshot ${index + 1}`} />
                  <img src={`${process.env.REACT_APP_BACKEND_URL}/${imagePath}`} alt={`Webcam ${index + 1}`} />
                </div>
                <div className="detailed-analysis">
                  <strong>Detailed Analysis:</strong><br />
                  {emotions.map((emotionObject, emotionIndex) => (
                    <div key={emotionIndex}>
                      {emotionObject.label}: {(emotionObject.score * 100).toFixed(2)}%
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      
    </div>
    
    
  );
};

export default ExpressionAnalysis;
