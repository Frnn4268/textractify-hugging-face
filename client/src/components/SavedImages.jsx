import { useState, useEffect } from 'react';
import axios from 'axios';
import './SavedImages.css'; 

function SavedImages() {
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
    <div className="saved-images-container">
      <h1 className="title">Saved Images!</h1>
      <ul className="image-list">
        {images.map((image, index) => (
          <li key={index} className="image-item">
            <img src={image.imagePath} alt="Saved" className="saved-image" />
            <p className="description">Description: {image.description}</p>
            <p className="description">Translated Description: {image.translatedDescription}</p>
            <p className="date">{new Date(image.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedImages;
