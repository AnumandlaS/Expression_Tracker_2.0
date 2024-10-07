// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// const OverallAnalysis = () => {
//   const { sessionId } = useParams();
//   const [analysisData, setAnalysisData] = useState(null); // Initialize as null to indicate no data initially
//   const [loading, setLoading] = useState(true); // Track loading state

//   useEffect(() => {
//     fetchSessionData();
//   }, [sessionId]);

//   const fetchSessionData = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/sessions/${sessionId}`);
//       const data = await response.json(); // Parse response as JSON
//       console.log("Fetched data: ", data);
//       setAnalysisData(data); // Set parsed data to the state
//       setLoading(false); // Stop loading once data is fetched
//     } catch (error) {
//       console.error('Error fetching session data:', error);
//       setLoading(false); // Ensure loading stops even if there is an error
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h1 className="text-center">Overall Analysis for Session Name: {analysisData?.sessionName}</h1>

     
//     </div>
//   );
// };

// export default OverallAnalysis;



import React, { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";
import { useParams } from 'react-router-dom';

const OverallExpressionAnalysis = () => {
  const [emotionAverages, setEmotionAverages] = useState({});
  const { sessionId } = useParams();
  
  // References for the charts
  const donutChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    const fetchEmotionData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sessions/${sessionId}`);
        const modelResponse = response.data;

        const emotionTotals = {};
        let count = 0;

        modelResponse.forEach((imageEmotions) => {
          imageEmotions.forEach((emotion) => {
            if (!emotionTotals[emotion.label]) {
              emotionTotals[emotion.label] = 0;
            }
            emotionTotals[emotion.label] += emotion.score;
          });
          count++;
        });

        const averages = {};
        for (const [label, total] of Object.entries(emotionTotals)) {
          averages[label] = (total / count) * 100;
        }

        setEmotionAverages(averages);
      } catch (error) {
        console.error("Error fetching emotion data", error);
      }
    };

    fetchEmotionData();
  }, [sessionId]);

  useEffect(() => {
    if (Object.keys(emotionAverages).length > 0) {
      // Destroy existing donut chart if it exists
      if (donutChartRef.current) {
        donutChartRef.current.destroy();
      }

      // Destroy existing bar chart if it exists
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }

      const ctx1 = document.getElementById("overallChart").getContext("2d");
      const ctx2 = document.getElementById("overallBarChart").getContext("2d");

      const labels = Object.keys(emotionAverages);
      const data = Object.values(emotionAverages);

      // Create Donut Chart
      donutChartRef.current = new Chart(ctx1, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Average Emotions",
              data: data,
              backgroundColor: ["#4caf50", "#2196f3", "#f44336", "#ff9800", "#9c27b0"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "top" },
          },
        },
      });

      // Create Bar Chart
      barChartRef.current = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Average Emotions",
              data: data,
              backgroundColor: ["#4caf50", "#2196f3", "#f44336", "#ff9800", "#9c27b0"]

            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Percentage (%)" },
            },
          },
        },
      });
    }

    // Cleanup function to destroy charts when the component unmounts
    return () => {
      if (donutChartRef.current) donutChartRef.current.destroy();
      if (barChartRef.current) barChartRef.current.destroy();
    };
  }, [emotionAverages]);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Overall Expression Analysis</h1>
      <div className="row my-4">
        <div className="col-md-12">
          <h4>Average Emotion Percentages of </h4>
          <ul>
            {Object.entries(emotionAverages).map(([emotion, avg]) => (
              <li key={emotion}>
                {emotion.charAt(0).toUpperCase() + emotion.slice(1)}: {avg.toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id="chartContainer" className="row">
        <div className="col-md-6">
          <canvas id="overallChart" width="400" height="400"></canvas>
        </div>
        <div className="col-md-6">
          <canvas id="overallBarChart" width="400" height="400"></canvas>
        </div>
      </div>
    </div>
  );
};

export default OverallExpressionAnalysis;
