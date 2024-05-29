import React from 'react';
import './components.css'; // Importando o arquivo CSS local

function ProcessedImage({ image }) {
  return (
    <div className="processed-image-container">
      <h2>Processed Image</h2>
      {image ? (
        <img src={`http://localhost:8000/image/${image}`} alt="Processed" />
      ) : (
        <p>No processed image.</p>
      )}
    </div>
  );
}

export default ProcessedImage;
