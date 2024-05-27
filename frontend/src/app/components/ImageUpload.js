import React, { useState } from 'react';
import axios from 'axios';
import './components.css';

function ImageUpload({ onImageUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios.post('http://localhost:8000/upload', formData)
        .then(response => {
          onImageUpload(response.data);
        })
        .catch(error => console.error('Error uploading image:', error));
    }
  };

  return (
    <div className="image-upload-container">
      <h2>Upload Image</h2>
      <input type="file" accept="image/jpeg, image/png, image/tiff" onChange={handleFileChange} />
      <button className="upload-button" onClick={handleUpload}>Upload Image</button>
    </div>
  );
}

export default ImageUpload;
