import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUpload from './components/ImageUpload';
import ProcessedImage from './components/ProcessedImage';
import OperationsList from './components/OperationsList';
import './App.css';

function App() {
  // Estado para armazenar a imagem enviada e as operações realizadas
  const [uploadedImage, setUploadedImage] = useState(null);
  const [appliedOperations, setAppliedOperations] = useState([]);

  // Função para lidar com o upload da imagem
  const handleImageUpload = (data) => {
    setUploadedImage(data); // Define a imagem enviada
    setAppliedOperations([]); // Limpa as operações aplicadas
  };

  // Função para lidar com as operações aplicadas na imagem
  const handleOperationApply = (operations) => {
    setAppliedOperations(operations); // Define as operações aplicadas
  };

  // Função para lidar com o salvamento da imagem
  const handleImageSave = () => {
    // Lógica para salvar a imagem no backend
    console.log('Imagem salva com sucesso!');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rota para a página principal, que inclui upload, imagem e operações */}
          <Route path="/" element={
            <div>
              {/* Componente ImageUpload para fazer o upload da imagem */}
              <ImageUpload onImageUpload={handleImageUpload} />
              
              {/* Componente ProcessedImage para exibir a imagem processada */}
              {uploadedImage && <ProcessedImage image={uploadedImage} appliedOperations={appliedOperations}/>}

              
              {/* Componente OperationsList para aplicar operações na imagem */}
              {uploadedImage && (
                <OperationsList
                  imageId={uploadedImage.id} // Passa o ID da imagem
                  onProcess={handleOperationApply}
                  onImageSave={handleImageSave}
                />
              )}
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
