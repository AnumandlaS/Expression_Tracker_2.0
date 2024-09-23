import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Analysis = () => {
  const [sessions, setSessions] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);  // Declare state for analysis results
  const [loadingAnalysis, setLoadingAnalysis] = useState(false); // Declare state for loading analysis


  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("http://localhost:5000/sessions");
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  const handleSessionClick = async (sessionId) => {
    setSelectedSessionId(sessionId);
    try {
      const response = await fetch(`http://localhost:5000/sessions/${sessionId}/images`);
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Fetch analysis for a selected session
  const handleFetchAnalysis = async () => {
    if (!selectedSessionId) return;

    setLoadingAnalysis(true);  // Set loading to true while the analysis is processing
    try {
      const response = await fetch(`http://localhost:5000/sessions/${selectedSessionId}/analyze`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error("Failed to fetch analysis");
      }
      const data = await response.json();
      setAnalysisResults(data.analysisResults);  // Store the analysis results
      setLoadingAnalysis(false);  // Set loading to false after analysis completes
    } catch (error) {
      console.error("Error fetching analysis:", error);
      setLoadingAnalysis(false);
    }
  };


  return (
    <div className="analysis">
      <h2>Analysis Section</h2>
      {sessions.length > 0 ? (
        <ul>
          {sessions.map((sessionId) => (
            <li key={sessionId}>
              <button onClick={() => handleSessionClick(sessionId)}>
                Session ID: {sessionId}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No sessions available.</p>
      )}
      
      {selectedSessionId && (
        <div>
          <h3>Images for Session ID: {selectedSessionId}</h3>
          {images.length > 0 ? (
            <div>
              {images.map((image) => (
                <img key={image._id} src={`http://localhost:5000/${image.imagePath}`} alt="Session Capture" style={{ width: '100px', margin: '10px' }} />
              ))}
            </div>
          ) : (
            <p>No images captured for this session.</p>
          )}
          {/* Fetch Analysis button */}
          <button onClick={handleFetchAnalysis} disabled={loadingAnalysis}>
            {loadingAnalysis ? 'Fetching Analysis...' : 'Fetch Analysis'}
          </button>

          {/* Display analysis results if available */}
          {analysisResults && (
            <div className="analysis-results">
              <h4>Analysis Results</h4>
              {analysisResults.map((result, index) => (
                <div key={index}>
                  <p>Image: {result.imagePath}</p>
                  <pre>{JSON.stringify(result.modelResponse, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analysis;
