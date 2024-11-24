import React, { useState, useEffect } from 'react';//we are import react in order to use in code and use state and use effect hooks
import axios from 'axios';//it will help us to make http requests
import { useParams, useLocation } from 'react-router-dom'; // Import useLocation
import '../styles/DetailedAnalysis.css';//importing game.css
import { useNavigate } from 'react-router-dom';//importing useNavigate 
import NavBar from './Navbar';

const ExpressionAnalysis = () => {
  const [sessionData, setSessionData] = useState(null); //it is a state variable where we are setting the sessiondata initial to null after wards we are changing
  const [loading, setLoading] = useState(true); //it is also a state varable where we are seting initail vale og loading to true and afterwards we are changing
  const [error, setError] = useState(null); //it is also a state variable
  const { sessionId } = useParams(); //we are using useparams beacuse we trying to fetch the data dynamic of a particular session id so using params we can striaghtly direct to backend and fetch the data easily
  const navigate = useNavigate();//we are navigate in order to navigate between two pages

  const location = useLocation();  // Get location to fetch passed state
  const { username } = location.state || {}; // Destructure `username` from state
  
  useEffect(() => {//this hook fetches data when the sesssionid parameter changes,ensuring dynamic loading
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
    if (sessionData) {
      console.log('Updated sessionData:', sessionData);
    }
  }, [sessionId]);

  
  //here we are caluclating the highest emotion among the given array or passed array and converting the result to percentages
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
  //This condition checks whether the data is still being fetched from the backend.
  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="circular-loader"></div>
      </div>
    );
  }
  //This condition checks whether an error occurred during the data-fetching process.
  if (error) {
    return <p>{error}</p>;
  }
  //this is will excetued when we dont have any session data like their are no imahes or screenshots or model respone is not available then it will get ecxceted
  if (!sessionData || !sessionData.imagePaths || !sessionData.screenshotPaths || !sessionData.modelResponse) {
    return <p>No data found for this session.</p>;
  }

  // If handleAnalysisClick is not needed, remove it or implement its functionality
const handleAnalysisClick = () => {
  navigate('/analysis',{state:{username}});
};

// If handleLogout is used, define it
const handleLogout = () => {
  // Your logout logic here
  navigate('/');
};

//in brief we can say that this return statment have nav bar,image strip displaying result,and a button to navigate to home page
  return (

    <div className="container-fluid">

<NavBar username={username} handleLogout={handleLogout} role="admin" />
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
        <div className="text-center mt-4">
        <button className="home-button" onClick={handleAnalysisClick}>
          Home
        </button>
      </div>
      </div>
      
    </div>
  );
};

export default ExpressionAnalysis;
