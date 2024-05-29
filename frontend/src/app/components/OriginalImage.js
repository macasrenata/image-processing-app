import React from 'react';
import './components.css'; // Importando o arquivo CSS local

function OriginalImage({ image }) {
  return (
    <div className="original-image-container"> {/* Adicionando uma classe container para o componente */}
      <h2>Original Image</h2>
      {image ? (
        <img src={`http://localhost:8000/image/${image.id}`} alt="Original" />
      ) : (
        <p>No image selected.</p>
      )}
    </div>
  );
}

export default OriginalImage;
