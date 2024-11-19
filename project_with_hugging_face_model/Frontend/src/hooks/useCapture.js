import { useRef,useEffect,useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";

const useCapture = (videoRef, sessionId) => {

  //   const location = useLocation();
  // const [sessionName, setSessionName] = useState("");

  // useEffect(() => {
  //   const session = location.state?.sessionName || "Unnamed Session";
  //   setSessionName(session);
  //   console.log("Session Name (in game.js):", session); // Ensure this is printed correctly
  // }, [location.state]);

  const canvasRef = useRef(null);
    // this function is to capture images 
  const captureImage = (newsessionId,sessionName) => {
    console.log("Capture image function called ");
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // this below function is to send the captured images along with the 
    // sessionID,sessionName to the backend 
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append("image", blob, "capture.png");
      formData.append("newSessionId", newsessionId);
      formData.append("sessionName",sessionName);
        console.log("in useCapture ",newsessionId,sessionName);
      axios.post("http://localhost:5000/uploads", formData)
        .then((response) => console.log("Image uploaded:", response.data))
        .catch((error) => console.error("Error uploading image:", error));
    });
  };
  //   this functio is to capture screenshots
  const captureScreenshot = (newsessionId,sessionName) => {
    console.log("Capture screenshot function called ");
    html2canvas(document.body).then((screenshotCanvas) => {
      // this function is to send the captured screenshots along with the sessionId , sessionName 
      // to the backend 
      screenshotCanvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append("screenshot", blob, "screenshot.png");
        formData.append("newSessionId", newsessionId);
        formData.append("sessionName",sessionName);

        axios.post("http://localhost:5000/screenshots", formData)
          .then((response) => console.log("Screenshot uploaded:", response.data))
          .catch((error) => console.error("Error uploading screenshot:", error));
      });
    });
  };

  return { canvasRef, captureImage, captureScreenshot };
};

export default useCapture;
