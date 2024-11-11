import React, { useState, useEffect } from "react";
import "./TimerBar.css";

function TimerBar() {
  const [seconds, setSeconds] = useState(180); // 2 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const width = (seconds / 120) * 100; // Calculate width based on remaining seconds

  return (
    <div className="timer-bar">
      <div className="timer-fill" style={{ width: `${width}%` }}></div>
    </div>
  );
}

export default TimerBar;
