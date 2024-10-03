import { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
      <h1>Saved Images!</h1>
      <ul>
        {images.map((image, index) => (
          <li key={index}>
            <p>{image.description}</p>
            <p>{new Date(image.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedImages;