import React from 'react';
import './components.css'; // Importando o arquivo CSS local

function ProcessedImage({ image }) {
  return (
    <div className="processed-image-container"> {/* Adicionando uma classe container para o componente */}
      <h2>Processed Image</h2>
      {image ? <img src={`data:image/jpeg;base64,${image.data}`} alt="Processed" /> : <p>No processed image.</p>}
    </div>
  );
}

export default ProcessedImage;
