import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OverallAnalysis = () => {
  const { sessionId } = useParams();
  const [analysisData, setAnalysisData] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        // Fetching session data from the backend
        const response = await fetch(`http://localhost:5000/sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }
        const data = await response.json();
        console.log(data);
        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setAnalysisData(data);
        } else {
          setAnalysisData([data]); // If it's an object, wrap it in an array
        }

      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Overall Analysis for Session ID: {sessionId}</h1>
      {analysisData.length > 0 ? (
        analysisData.map((result, index) => (
          <div key={index}>
            <p>Image: {result.imagePath}</p>
            <pre>{JSON.stringify(result.modelResponse, null, 2)}</pre>
          </div>
        ))
      ) : (
        <p>Loading analysis data...</p>
      )}
    </div>
  );
};

export default OverallAnalysis;
