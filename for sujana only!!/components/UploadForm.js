import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate(); // Updated initialization

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', file);
    formData.append('sessionId', sessionId);

    fetch('/uploads', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Upload success:', data);
        // Redirect to the analysis page with the session ID
        navigate(`/analysis/${data.sessionId}`); // Updated navigation
      })
      .catch(error => console.error('Error uploading file:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        placeholder="Enter session ID"
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadForm;
