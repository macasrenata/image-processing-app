import React, { useState } from 'react';
import axios from 'axios';
import './components.css';

function ImageUpload({ onImageUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null); // Limpa qualquer erro anterior ao selecionar um novo arquivo
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setError('Please select an image file.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    axios.post('http://localhost:8000/upload', formData)
      .then(response => {
        onImageUpload(response.data);
      })
      .catch(error => {
        setError('Error uploading image. Please try again.');
        console.error('Error uploading image:', error);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <div className="image-upload-container">
      <h2>Upload Image</h2>
      <input type="file" onChange={handleFileChange} />
      <button className="upload-button" onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ImageUpload;
