import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Analysis.css'; // Make sure to compile the SCSS to CSS and include the correct path

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
      const response = await axios.get(`http://localhost:5000/sessions/analysis/${sessionId}`);
      if (response.data && response.data.analysisResults) {
        setExistingAnalysis((prevState) => ({
          ...prevState,
          [sessionId]: true,
        }));
      } else {
        const mediaResponse = await axios.get(`http://localhost:5000/sessions/media/${sessionId}`);
        const { imagePaths = [], screenshotPaths = [] } = mediaResponse.data;

        const media = [...imagePaths, ...screenshotPaths];
        if (media.length === 0) return;

        const analysisResponse = await axios.post(`http://localhost:5000/sessions/analyze/${sessionId}`, { images: media });
        if (analysisResponse.data && analysisResponse.data.analysisResults) {
          const analysisResults = analysisResponse.data.analysisResults;
          await axios.post(`http://localhost:5000/sessions/${sessionId}/save-analysis`, { analysisResults });
          setExistingAnalysis((prevState) => ({
            ...prevState,
            [sessionId]: true,
          }));
          navigate(`/analysis/${sessionId}`);
        }
      }
    } catch (error) {
      console.error('Error during analysis process:', error);
    } finally {
      setLoadingSessionId(null);
    }
  };

  return (
    <div className="container mt-4 scrollable-table-container">
      <h1 className="text-center">
        SESSIONS
        {isLoading && (
          <div className="wrapper">
            <svg className="hourglass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 206" preserveAspectRatio="none">
              <path className="middle" d="M120 0H0v206h120V0zM77.1 133.2C87.5 140.9 92 145 92 152.6V178H28v-25.4c0-7.6 4.5-11.7 14.9-19.4 6-4.5 13-9.6 17.1-17 4.1 7.4 11.1 12.6 17.1 17zM60 89.7c-4.1-7.3-11.1-12.5-17.1-17C32.5 65.1 28 61 28 53.4V28h64v25.4c0 7.6-4.5 11.7-14.9 19.4-6 4.4-13 9.6-17.1 16.9z"/>
              <path className="outer" d="M93.7 95.3c10.5-7.7 26.3-19.4 26.3-41.9V0H0v53.4c0 22.5 15.8 34.2 26.3 41.9 3 2.2 7.9 5.8 9 7.7-1.1 1.9-6 5.5-9 7.7C15.8 118.4 0 130.1 0 152.6V206h120v-53.4c0-22.5-15.8-34.2-26.3-41.9-3-2.2-7.9-5.8-9-7.7 1.1-2 6-5.5 9-7.7zM70.6 103c0 18 35.4 21.8 35.4 49.6V192H14v-39.4c0-27.9 35.4-31.6 35.4-49.6S14 81.2 14 53.4V14h92v39.4C106 81.2 70.6 85 70.6 103z"/>
            </svg>
          </div>
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
              const timestamp = new Date(session.timestamp);
              const date = timestamp.toLocaleDateString();
              const time = timestamp.toLocaleTimeString();

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
