import { useState, useRef } from "react";

// Request webcam access
const useWebcam = () => {
    const videoRef = useRef(null);
    const [webcamGranted, setWebcamGranted] = useState(false);

    const requestWebcamAccess = () => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                console.log("Webcam access granted");
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setWebcamGranted(true);
                } else {
                    console.error("Video element not found!");
                }
            })
            .catch((err) => {
                console.error("Error accessing webcam:", err);
                setWebcamGranted(false);
            });
    };

    return { videoRef, webcamGranted, requestWebcamAccess };
};

export default useWebcam;
