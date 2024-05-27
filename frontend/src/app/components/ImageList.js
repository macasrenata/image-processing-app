import React from 'react';
import './components.css';

function ImageList({ images, onSelect }) {
  return (
    <div className="image-list-container">
      <h2>Image List</h2>
      <ul className="image-list">
        {images.map(image => (
          <li key={image.id} className="image-item" onClick={() => onSelect(image)}>
            {image.filename}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ImageList;