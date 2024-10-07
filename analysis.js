import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import Overall from './overall';
import Detailed from './detailed';


const Analysis = () => {
  // Your analysis logic here, which can be passed to both components
  const analysisData = {
    overall: 'Summary data here...',
    detailed: 'Detailed data for analysis here...'
  };

  return (
    <div>
      {/* You can pass data to Overall and Detailed if needed */}
      <Overall data={analysisData.overall} />
      <Detailed data={analysisData.detailed} />
    </div>
  );
};
const DetailedEmotionAnalysis = () => {
  useEffect(() => {
    // Donut Chart
    const ctx1 = document.getElementById('emotionChart').getContext('2d');
    const emotionChart = new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Happy', 'Angry', 'Surprised'],
        datasets: [{
          label: 'Emotions',
          data: [75, 10, 15],
          backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        }
      }
    });

    // Bar Chart
    const ctx2 = document.getElementById('emotionBarChart').getContext('2d');
    const emotionBarChart = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Happy', 'Angry', 'Surprised'],
        datasets: [{
          label: 'Emotions',
          data: [75, 10, 15],
          backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Percentage (%)'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          }
        }
      }
    });

    // Clean up charts on component unmount
    return () => {
      emotionChart.destroy();
      emotionBarChart.destroy();
    };
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Detailed Emotion Analysis</h1>
      
      {/* Captured Images */}
      <div className="row mb-4">
        <div className="col-md-12 image-container d-flex justify-content-center">
          <div className="me-3">
            <img src="uploads/1727247079189-capture.png" alt="Webcam Capture" className="img-fluid captured-image" />
            <p><strong>Timestamp:</strong> 2024-09-27 14:30:00</p>
          </div>
          <div>
            <img src="screenshots/1727420677237-screenshot.png" alt="Game Screenshot" className="img-fluid screenshot-image" />
          </div>
        </div>
      </div>
      
      <p>Happy: 75% | Angry: 10% | Surprised: 15%</p>

      {/* Charts Side by Side */}
      <div id="chartContainer" className="row">
        <div className="col-md-6">
          <canvas id="emotionChart" width="400" height="400"></canvas>
        </div>
        <div className="col-md-6">
          <canvas id="emotionBarChart" width="400" height="400"></canvas>
        </div>
      </div>

      <a href="session.html" className="btn btn-secondary mt-4">Back to Home</a>
    </div>
  );
};

export default DetailedEmotionAnalysis;
