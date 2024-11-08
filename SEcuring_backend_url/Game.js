
import React, { useState, useEffect } from "react";//
import { useRef } from "react";//allow components to hold information that is not used for rendering
import "./Game.css";
import confetti from "canvas-confetti";
import axios from "axios";//for https requests
import html2canvas from "html2canvas"; // Import html2canvas screenshots 
import { useLocation } from "react-router-dom";//for finding an location of the things
import TimerBar from "./TimerBar";

const questions = [//this are the questions which are in form of array of objects
  {
    question: "Guess the correct spelling",
    image: "images/baby.jpeg",
    answers: [
      { text: "baby", correct: true },
      { text: "bady", correct: false },
      { text: "dady", correct: false },
      { text: "daby", correct: false },
    ],
  },
  {
    question: "Guess the spelling correctly",
    image: "images/cat.jpeg",
    answers: [
      { text: "cat", correct: true },
      { text: "kat", correct: false },
    ],
  },
  {
    question: "Which of the two is correct ???",
    image: "images/q3.jpeg.jpg",
    answers: [
      { text: "A", correct: true },
      { text: "B", correct: false },
    ],
  },
  {
    question: "What is the boy doing ???",
    image: "images/swimming.jpg",
    answers: [
      { text: "SWIMMING", correct: true },
      { text: "SWIMMMING", correct: false },
    ],
  },
  {
    question: "Guess the spelling correctly",
    image: "images/hat.jpg",
    answers: [
      { text: "nat", correct: false },
      { text: "hat", correct: true },
    ],
  },
  {
    question: "Guess the number of 9 in the picture",
    image: "images/Screenshot 2024-10-25 123528.png",
    answers: [
      { text: "3", correct: false },
      { text: "5", correct: true },
      { text: "4", correct: false },
      { text: "1", correct: false },

    ],
  },
  {
    question: "Guess the number of d's in the picture",
    image: "images/bd.png",
    answers: [
      { text: "3", correct: false },
      { text: "6", correct: true },
      { text: "4", correct: false },
      { text: "1", correct: false },

    ],
  },
  
  // ... Other questions
];

const Game = () => {//here game is functinal component 
  const location = useLocation();//this stores the url data assecced with uselocation
  const [sessionName, setSessionName] = useState("");//

  useEffect(() => {
    const session = location.state?.sessionName || "Unnamed Session";
    setSessionName(session);
    console.log("Session Name (in game.js):", session); // Ensure this is printed correctly
  }, [location.state]);

  //these are some state variables 
  const [shuffledQuestions, setShuffledQuestions] = useState([]);//Holds the question after shuffling
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);//tracks the active question
  const [score, setScore] = useState(0);//stores the players score
  const [timeRemaining, setTimeRemaining] = useState(2 * 60); // 2 minutes
  const [showEndScreen, setShowEndScreen] = useState(false);//tracks if the end screen should display
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);//stroes the index of the selected ans
  const [answerStates, setAnswerStates] = useState([]); // keeps thewrong an dcoreect ans for styling
  const [hasStarted, setHasStarted] = useState(false); // New state for game start

  const [webcamGranted, setWebcamGranted] = useState(false); // State to track webcam access
  const [sessionId, setSessionId] = useState(null); // State for session ID
  const { v4: uuidv4 } = require("uuid");
  let newSessionId = "null";

  const videoRef = useRef(null); // Reference to the video element
  const canvasRef = useRef(null); // Reference to the canvas element for capturing images
  const captureIntervalRef = useRef(null); // To store the interval ID for image capture

  const [file, setFile] = useState(null);
  const isCameraActive = () => {
    const stream = videoRef.current?.srcObject;
    if (stream && stream.getVideoTracks().length > 0) {
      const track = stream.getVideoTracks()[0];
      return track.readyState === "live" && track.enabled; // Check if track is live and enabled
    }
    return false;
  };

  // Function to request webcam access
  const requestWebcamAccess = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true }) //this function requests the access to the users webcam using this line of code
      .then((stream) => {
        videoRef.current.srcObject = stream;//if the access is gaurnted than the video stream will bestored in video ref
        setWebcamGranted(true);

        const track = stream.getVideoTracks()[0];

        videoRef.current.style.display = "none"; // hide the vedio feed

      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
        setWebcamGranted(false); // Webcam access denied
      });
  };

  useEffect(() => {
    // shuffling the questions during the game play
    setShuffledQuestions(questions.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (timeRemaining > 0 && !showEndScreen) {
      const timerId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeRemaining <= 0) {
      endGame();
    }
  }, [timeRemaining, showEndScreen]);

  const startGame = () => {
    if (!webcamGranted || !isCameraActive()) {
      alert(
        "Please allow access to the camera and ensure it is active to start the game."
      );
      return;
    }
    newSessionId = uuidv4();
    setSessionId(uuidv4()); // Generate a new session ID
    console.log("Session id generated..." + newSessionId);
    setShuffledQuestions(questions.sort(() => Math.random() - 0.5));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeRemaining(2 * 60);
    setShowEndScreen(false);
    setSelectedAnswerIndex(null);
    setAnswerStates([]);
    setHasStarted(true); // Start the game
    captureIntervalRef.current = setInterval(captureImage, 10000);//image capture every 10 seconds
    document.body.classList.remove("correct", "wrong");
    document.body.style.backgroundColor = ""; // Reset to original color at the start
  };

  const captureImage = () => {
    if (!isCameraActive()) {
      alert("Camera is not active. Please ensure the camera is turned on.");
      return;
    }
    if (!newSessionId) {
      // Check if sessionId is null
      console.error("Session ID is null. Cannot capture images.");
      return; // Skip capture if no session ID is set
    }

    // Capture the video feed
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Capture the entire webpage using html2canvas
    html2canvas(document.body).then((screenshotCanvas) => {
      screenshotCanvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append("screenshot", blob, "screenshot.png"); // Screenshot of the page
        formData.append("newSessionId", newSessionId); // Add session ID to the form data
        formData.append("sessionName", sessionName);
        console.log("Captured screenshot. Session ID: " + newSessionId);
        
        // Send the screenshot image to the server
        axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/screenshots`, formData)
          .then((response) =>
            console.log("Screenshot uploaded:", response.data)
          )
          .catch((error) =>
            console.error("Error uploading screenshot:", error)
          );
      });
    });

    // Capture the video feed image as before
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append("image", blob, "capture.png"); // Append the image file
      formData.append("newSessionId", newSessionId); // Append the session ID
      formData.append("sessionName", sessionName); // Append the session name

      console.log(
        "Image captured. Session ID: " +
          newSessionId +
          " | Session Name: " +
          sessionName
      );

      // Send the image, session ID, and session name to the server
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/uploads`, formData)
        .then((response) =>
          console.log("Image uploaded with session details:", response.data)
        )
        .catch((error) =>
          console.error("Error uploading image with session details:", error)
        );
    });
  };
  const setNextQuestion = () => {
    setSelectedAnswerIndex(null);
    setAnswerStates([]);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const selectAnswer = (index, correct) => {
    if (selectedAnswerIndex !== null) return; // Prevent further clicks

    const correctIndex = shuffledQuestions[
      currentQuestionIndex
    ].answers.findIndex((ans) => ans.correct);
    const newAnswerStates = shuffledQuestions[currentQuestionIndex].answers.map(
      (ans, i) => {
        if (i === correctIndex) {
          return "correct";
        }
        if (i === index) {
          return correct ? "correct" : "wrong";
        }
        return "wrong";
      }
    );

    setSelectedAnswerIndex(index);
    setAnswerStates(newAnswerStates);

    if (correct) {
      setScore((prevScore) => prevScore + 1);
      document.body.classList.add("correct");
    } else {
      document.body.classList.add("wrong");
    }

    // Delay for visual feedback before moving to the next question
    setTimeout(() => {
      document.body.classList.remove("correct", "wrong"); // Remove the class before next question
      document.body.style.backgroundColor = ""; // Reset to original color

      if (currentQuestionIndex + 1 < shuffledQuestions.length) {
        setNextQuestion();
      } else {
        endGame();
      }
    }, 1000); // 1 second delay
  };

  const endGame = () => {
    setShowEndScreen(true);
    clearInterval(captureIntervalRef.current); // Stop image capture

    document.body.classList.remove("correct", "wrong");
    document.body.style.backgroundColor = ""; // Reset to original color for end screen
    triggerConfetti();
  };

  const triggerConfetti = () => {
    let particleCount = 500;
    const colorOptions = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#ffffff",
    ];

    const createConfetti = () => {
      confetti({
        particleCount: 10,
        spread: 360,
        startVelocity: Math.random() * 15 + 15,
        ticks: 300,
        gravity: 0.6,
        colors: [colorOptions[Math.floor(Math.random() * colorOptions.length)]],
        origin: { x: Math.random(), y: -0.1 },
      });
    };

    const confettiInterval = setInterval(() => {
      createConfetti();
      particleCount -= 10;
      if (particleCount <= 0) {
        clearInterval(confettiInterval);
      }
    }, 30);

    setTimeout(() => clearInterval(confettiInterval), 10000);
  };

  return (
    <div className="game-container">
      {/* <Header /> */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ display: "none" }}
      ></video>
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width="640"
        height="480"
      ></canvas>

      {!webcamGranted ? (
        <div className="start-screen">
          <button className="btn start-btn" onClick={requestWebcamAccess}>
            Allow to access camera
          </button>
        </div>
      ) : !hasStarted ? (
        <div className="start-screen">
          <button className="btn start-btn" onClick={startGame}>
            Start
          </button>
        </div>
      ) : !showEndScreen ? (
        <>
          <div className="timer">
            Time Remaining: {Math.floor(timeRemaining / 60)}:
            {(timeRemaining % 60).toString().padStart(2, "0")}
            <TimerBar />
          </div>
          <div id="question-container">
            <div className="question-text">
              {shuffledQuestions[currentQuestionIndex]?.question}
            </div>
            <img
              src={shuffledQuestions[currentQuestionIndex]?.image}
              alt="Question"
              className="question-img"
            />
            <div className="btn-grid">
              {shuffledQuestions[currentQuestionIndex]?.answers.map(
                (answer, index) => (
                  <button
                    key={index}
                    className={`btn ${answerStates[index] || ""}`}
                    onClick={() => selectAnswer(index, answer.correct)}
                    disabled={selectedAnswerIndex !== null}
                  >
                    {answer.text}
                  </button>
                )
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="end-screen">
          <div className="end-message">
            {score === questions.length
              ? "Congrats! You have scored full marks!"
              : "You’ve Completed the Quiz!"}
          </div>
          <div className="score">
            Your score: {score}/{questions.length}
          </div>
          <button className="btn" onClick={() => (window.location.href = "/select-game")}>
            Game Home
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
