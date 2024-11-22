import React, { useEffect ,useState,useRef} from "react";
import useSessionId from '../hooks/useSessionID';
import useWebcam from '../hooks/useWebcam';
import useCapture from '../hooks/useCapture';
import "../styles/Game.css";
import confetti from "canvas-confetti";
import { useLocation,useNavigate } from "react-router-dom";
import TimerBar from "./TimerBar";
const questions = [
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
  // ... Other questions
];
const Game = () => {
  const location = useLocation();
  const { username } = location.state || {}; // Destructure `username` from state
  console.log(username);
  const sessionName=username;
  console.log("username as Session Id :",sessionName);
  const { sessionId } = useSessionId();
  console.log(sessionId);
  const { videoRef, webcamGranted, requestWebcamAccess, cameraActive } = useWebcam(); // Added cameraActive
  const { canvasRef, captureImage, captureScreenshot} = useCapture(videoRef, sessionId); // Extracted additional states and functions

  const captureIntervalRef = useRef(null);

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(2 * 60); // 3 minutes
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [answerStates, setAnswerStates] = useState([]); // Array to track button states
  const [hasStarted, setHasStarted] = useState(false); // New state for game start
  // const location = useLocation();
  // const [sessionName, setSessionName] = useState("");

  // useEffect(() => {
  //   const session = location.state?.sessionName || "Unnamed Session";
  //   setSessionName(session);
  //   console.log("Session Name (in game.js):", session); // Ensure this is printed correctly
  // }, [location.state]);

  // useEffect(() => {
  //   if (!webcamGranted) {
  //     requestWebcamAccess();
  //   }
  // }, [webcamGranted, requestWebcamAccess]);

  //const location = useLocation();
  // const { username1 } = location.state || {}; // Destructure `username` from state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    let timer;
    if (hasStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      endGame(); // End the game when time runs out
    }
    return () => clearInterval(timer); // Clean up interval
  }, [hasStarted, timeRemaining]);

  
  const startCapture = () => {
    console.log("Startcapture function called ");
    setShuffledQuestions(questions.sort(() => Math.random() - 0.5));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeRemaining(2 * 60);
    setShowEndScreen(false);
    setSelectedAnswerIndex(null);
    setAnswerStates([]);
    setHasStarted(true); // Start the game
    if (webcamGranted) {
      //Capture image and screenshot every 10 seconds
      captureIntervalRef.current = setInterval(() => {
        // this fuction is actually written in useCapture.js hook
                    captureImage(sessionId,sessionName);
                    captureScreenshot(sessionId,sessionName);
                  }, 10000);// for setinterval function we gave timer as 10 seconds to cspture image and screenshot for every 10 seconds
      //captureIntervalRef.current = setInterval(captureImage(),captureScreenshot(), 10000);
    }
    document.body.classList.remove("correct", "wrong");
    document.body.style.backgroundColor = ""; // Reset to original color at the start
 
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
          <button className="btn start-btn" onClick={startCapture}>
            Start
          </button>
        </div>
      ) : !showEndScreen ? (
        <>
          <div className="timer">
            <div>
            Time Remaining: {Math.floor(timeRemaining / 60)}:
            {(timeRemaining % 60).toString().padStart(2, "0")}
            
            </div>
            
            <TimerBar timeRemaining={timeRemaining} />
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
          <button
            className="btn"
            onClick={() => navigate("/select-game", { state: { username } })} // Pass the username to the next page
          >
            Back to games
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
