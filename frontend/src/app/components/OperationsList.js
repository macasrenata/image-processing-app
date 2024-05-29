import React from 'react';
import axios from 'axios';
import './components.css'; // Importando o arquivo CSS local

function OperationsList({ imageId, onProcess }) {
  const applyOperation = (operation) => {
    if (!imageId) {
      console.error('Image ID is not defined');
      return;
    }

    axios.post(`http://localhost:8000/process`, { image_id: imageId, operation })
      .then(response => {
        onProcess(response.data);
      })
      .catch(error => console.error('Error processing image:', error));
  };

  return (
    <div className="operations-list-container"> {/* Adicionando uma classe container para o componente */}
      <h2>Operations List</h2>
      <button className="operation-button" onClick={() => applyOperation('rotate_90')}>Rotate 90°</button>
      <button className="operation-button" onClick={() => applyOperation('rotate_180')}>Rotate 180°</button>
      <button className="operation-button" onClick={() => applyOperation('flip_horizontal')}>Flip Horizontal</button>
      <button className="operation-button" onClick={() => applyOperation('flip_vertical')}>Flip Vertical</button>
      <button className="operation-button" onClick={() => applyOperation('increase_contrast')}>Increase Contrast</button>
      <button className="operation-button" onClick={() => applyOperation('decrease_contrast')}>Decrease Contrast</button>
      <button className="operation-button" onClick={() => applyOperation('increase_brightness')}>Increase Brightness</button>
      <button className="operation-button" onClick={() => applyOperation('decrease_brightness')}>Decrease Brightness</button>
    </div>
  );
}

export default OperationsList;

