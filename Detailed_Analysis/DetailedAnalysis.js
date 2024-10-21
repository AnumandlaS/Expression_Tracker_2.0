import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios for API calls
import './DetailedAnalysis.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExpressionAnalysis = () => {
  const [sessionData, setSessionData] = useState(null); // State to hold session data from MongoDB
  const [selectedEmotion, setSelectedEmotion] = useState('all'); // State for selected emotion
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const { sessionId } = useParams(); // Get sessionId from URL params
 console.log(sessionId);
  // Fetch session data from backend
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/detailed_sessions/${sessionId}`);
        console.log('Fetched session data:', response.data); // Log fetched data
        setSessionData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching session data');
        setLoading(false);
      }
    };
    fetchSessionData();
  }, [sessionId]);
  // Log sessionData after it's updated
useEffect(() => {
    if (sessionData) {
      console.log('Updated sessionData:', sessionData); // Log updated sessionData
    }
  }, [sessionData]);
  // Handle the selection of emotion
  const handleEmotionChange = (event) => {
    setSelectedEmotion(event.target.value);
  };

  if (loading) {
    return <p>Loading...</p>; // Display loading state
  }

  if (error) {
    return <p>{error}</p>; // Display error message
  }

  // Ensure sessionData exists before rendering
  if (!sessionData) {
    return <p>No data found for this session.</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center">Expression Analysis</h1>

      {/* Search by Emotion */}
      <div className="my-3">
        <label htmlFor="emotionSearch">Search by Emotion</label>
        <select id="emotionSearch" className="form-select" onChange={handleEmotionChange}>
          <option value="all">All Emotions</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="angry">Angry</option>
          <option value="surprised">Surprised</option>
        </select>
      </div>

      {/* Expression Images Grid */}
<div className="row" id="imageGrid">
{sessionData.imagePaths.map((webcamImage, index) => {
  const gameImage = sessionData.screenshotPaths[index];
  const modelResponse = sessionData.modelResponse[index];
  const timestamp = sessionData.timestamp[index] || 'N/A'; // Default timestamp if not available
    console.log(modelResponse);
  return (
    <div className="col-md-4 mb-3" key={index} data-emotion={modelResponse[0]?.label}>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-6">
              <img src={`http://localhost:5000/${webcamImage.replace(/\\/g, '/')}`} alt="Webcam Image" className="img-fluid" />
            </div>
            <div className="col-6">
              <img src={`http://localhost:5000/${gameImage.replace(/\\/g, '/')}`} alt="Game Screenshot" className="img-fluid" />
            </div>
          </div>
          <p className="mt-3">
  {modelResponse.map((response, i) => (
    <span key={i}>
      {response.label.charAt(0).toUpperCase() + response.label.slice(1)}: {(
        response.score * 100
      ).toFixed(2)}% {/* Convert score to percentage */}
      {i < modelResponse.length - 1 ? ' | ' : ''} {/* Use '|' as separator */}
    </span>
  ))}
</p>
{/* <p><strong>Timestamp:</strong> {timestamp}</p> */}
        </div>
      </div>
    </div>
  );
})}

</div>

    </div>
  );
};

export default ExpressionAnalysis;
