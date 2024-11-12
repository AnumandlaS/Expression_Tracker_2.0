import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Analysis.css';

const Analysis = () => {
  const [sessions, setSessions] = useState([]);
  const [existingAnalysis, setExistingAnalysis] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSessionId, setLoadingSessionId] = useState(null);
  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/sessions');
      console.log("API Response:", response.data);
      const sortedSessions = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setSessions(sortedSessions);
    } catch (error) {
      console.error('Error fetching session data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSessionClick = async (sessionId) => {
    setLoadingSessionId(sessionId);
    try {
      console.log(`Requesting analysis for session ID: ${sessionId}`);
      const response = await axios.get(`http://localhost:5000/sessions/analysis/${sessionId}`);

      // Check for response status
      if (response.status === 200 && response.data && response.data.analysisResults) {
        console.log("Analysis already exists:", response.data.analysisResults);
        setExistingAnalysis((prevState) => ({
          ...prevState,
          [sessionId]: true,
        }));
      } else {
        setExistingAnalysis((prevState) => ({
          ...prevState,
          [sessionId]: false,
        }));
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("No analysis found. Sending images to Hugging Face model...");
        try {
          const mediaResponse = await axios.get(`http://localhost:5000/sessions/media/${sessionId}`);
          const { imagePaths = [], screenshotPaths = [] } = mediaResponse.data;

          const media = [...imagePaths, ...screenshotPaths];

          if (media.length === 0) {
            console.error("No media found for session.");
            return;
          }

          const analysisResponse = await axios.post(`http://localhost:5000/sessions/analyze/${sessionId}`, { images: media });

          if (analysisResponse.data && analysisResponse.data.analysisResults) {
            const analysisResults = analysisResponse.data.analysisResults;
            await axios.post(`http://localhost:5000/sessions/${sessionId}/save-analysis`, { analysisResults });

            setExistingAnalysis((prevState) => ({
              ...prevState,
              [sessionId]: true,
            }));
            navigate(`/analysis/${sessionId}`);
          } else {
            console.error("Analysis response did not contain results:", analysisResponse.data);
          }
        } catch (error) {
          console.error("Error during analysis process:", error.response ? error.response.data : error.message);
        }
      } else {
        console.error('Error during analysis request:', error.response ? error.response.data : error.message);
      }
    } finally {
      setLoadingSessionId(null); // Reset loading state after processing
    }
  };

  return (
    <div className="container mt-4 scrollable-table-container">
      <h1 className="text-center">
        SESSIONS
        {isLoading && (
          <span role="img" aria-label="loading" style={{ marginLeft: '10px' }}>
            ⌛
          </span>
        )}
      </h1>
      {!isLoading && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => {
              let date = 'N/A';
              let time = 'N/A';
              if (session.timestamp) {
                const timestamp = new Date(session.timestamp);
                date = timestamp.toLocaleDateString();
                time = timestamp.toLocaleTimeString();
              }

              return (
                <tr key={session.sessionId || index}>
                  <td>{session.sessionName}</td>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td>
                    <button 
                      className="analyze-button" 
                      onClick={() => handleSessionClick(session.sessionId)} 
                      disabled={loadingSessionId === session.sessionId}
                    >
                      Analyze
                      {loadingSessionId === session.sessionId && (
                        <span className="spinner-border spinner-border-sm loading-spinner" role="status" aria-hidden="true"></span>
                      )}
                    </button>
                    {existingAnalysis[session.sessionId] && (
                      <div>
                        <Link to={`/analysis/${session.sessionId}`} className="overall-analysis-button" style={{ marginRight: '10px' }}>
                          Overall Analysis
                        </Link><br />
                        <Link to={`/DetailedAnalysis/${session.sessionId}`} className="detailed-analysis-button">
                          Detailed Analysis
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Analysis;