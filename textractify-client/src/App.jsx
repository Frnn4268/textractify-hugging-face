import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ImageTable from './components/ImageTable';

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URL}/images`);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="App">
      <h1>Image Descriptions and Audio URLs</h1>
      <ImageTable images={images} setImages={setImages} />
    </div>
  );
}

export default App;