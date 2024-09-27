import React, { useEffect, useState } from "react";

const Analysis = () => {
  const [sessions, setSessions] = useState([]);
  const [images, setImages] = useState([]); // State for images
  const [screenshots, setScreenshots] = useState([]); // State for screenshots
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);  
  const [loadingAnalysis, setLoadingAnalysis] = useState(false); 

  // Fetch sessions from backend
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
      const response = await fetch(`http://localhost:5000/sessions/${sessionId}/media`);
      if (!response.ok) {
        throw new Error("Failed to fetch images and screenshots");
      }
      const data = await response.json();
      // Combine images and screenshots into a single array
      const media = [...(data.imagePaths || []), ...(data.screenshotPaths || [])];
      setImages(media);
    } catch (error) {
      console.error("Error fetching images and screenshots:", error);
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
          <h3>Media for Session ID: {selectedSessionId}</h3>

          {/* Render Images */}
          <h4>Images:</h4>
          {images.length > 0 ? (
  <div>
    {images.map((mediaPath, index) => (
      <img 
        key={index} 
        src={`http://localhost:5000/${mediaPath}`} 
        alt="Session Capture" 
        style={{ width: '100px', margin: '10px' }} 
      />
    ))}
  </div>
) : (
  <p>No media captured for this session.</p>
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
