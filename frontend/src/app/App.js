import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importe o componente Routes
import ImageUpload from './components/ImageUpload';
import ImageList from './components/ImageList';
import OriginalImage from './components/OriginalImage';
import ProcessedImage from './components/ProcessedImage';
import OperationsList from './components/OperationsList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Use o componente Routes */}
        <Routes>
          <Route path="/" element={<ImageUpload />} /> {/* Use o atributo element */}
          <Route path="/images" element={<ImageList />} />
          <Route path="/image/original/:id" element={<OriginalImage />} />
          <Route path="/image/processed/:id" element={<ProcessedImage />} />
          <Route path="/operations" element={<OperationsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
