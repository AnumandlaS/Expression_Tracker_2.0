import { useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";

const useCapture = (videoRef) => {
    const canvasRef = useRef(null);

    // Capture image from video stream
    const captureImage = (newSessionId, sessionName) => {
        console.log("Capture image function called");

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Null checks to ensure canvas and video exist
        if (!video || !canvas) {
            console.error("Canvas or Video element is missing!");
            return;
        }

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas content to Blob and upload
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error("Failed to create Blob from canvas");
                return;
            }
            const formData = new FormData();
            formData.append("image", blob, "capture.png");
            formData.append("newSessionId", newSessionId);
            formData.append("sessionName", sessionName);

            axios.post("http://localhost:5000/uploads", formData)
                .then((response) => console.log("Image uploaded:", response.data))
                .catch((error) => console.error("Error uploading image:", error));
        });
    };

    // Capture screenshot of the webpage
    const captureScreenshot = (newSessionId, sessionName) => {
        console.log("Capture screenshot function called");

        html2canvas(document.body).then((screenshotCanvas) => {
            screenshotCanvas.toBlob((blob) => {
                if (!blob) {
                    console.error("Failed to create Blob from screenshot");
                    return;
                }
                const formData = new FormData();
                formData.append("screenshot", blob, "screenshot.png");
                formData.append("newSessionId", newSessionId);
                formData.append("sessionName", sessionName);

                axios.post("http://localhost:5000/screenshots", formData)
                    .then((response) => console.log("Screenshot uploaded:", response.data))
                    .catch((error) => console.error("Error uploading screenshot:", error));
            });
        });
    };

    return { canvasRef, captureImage, captureScreenshot };
};

export default useCapture;
