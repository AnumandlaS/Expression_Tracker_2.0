
import React, { useEffect } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from 'react-router-dom';

const Overall = () => {
  const navigate = useNavigate();

  const handleDetailedAnalysis = () => {
    navigate('/detailed');  // Navigate to the detailed analysis page
  };

  return (
    <div>
      <h1>Overall Analysis</h1>
      <p>Summary of the overall analysis...</p>
      
      {/* Detailed Analysis Button */}
      <button onClick={handleDetailedAnalysis}>
        Detailed Analysis
      </button>
    </div>
  );
};
const OverallExpressionAnalysis = () => {
  useEffect(() => {
    // Donut Chart
    const ctx1 = document.getElementById("overallChart").getContext("2d");
    new Chart(ctx1, {
      type: "doughnut",
      data: {
        labels: ["Happy", "Sad", "Angry", "Surprised"],
        datasets: [
          {
            label: "Average Emotions",
            data: [70, 20, 5, 5],
            backgroundColor: ["#4caf50", "#2196f3", "#f44336", "#ff9800"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw}%`;
              },
            },
          },
        },
      },
    });

    // Bar Chart
    const ctx2 = document.getElementById("overallBarChart").getContext("2d");
    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: ["Happy", "Sad", "Angry", "Surprised"],
        datasets: [
          {
            label: "Average Emotions",
            data: [70, 20, 5, 5],
            backgroundColor: ["#4caf50", "#2196f3", "#f44336", "#ff9800"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Percentage (%)",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
      },
    });
  }, []); // Only run once when component is mounted

  return (
    <div className="container mt-4">
      <h1 className="text-center">Overall Expression Analysis</h1>

      {/* Overall Emotion Data */}
      <div className="row my-4">
        <div className="col-md-12">
          <h4>Average Emotion Percentages</h4>
          <ul>
            <li>Happy: 70%</li>
            <li>Sad: 20%</li>
            <li>Angry: 5%</li>
            <li>Surprised: 5%</li>
          </ul>
          <a href="detailed.html" className="btn btn-primary">
            Detailed Analysis
          </a>
        </div>
      </div>

      {/* Charts Side by Side */}
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