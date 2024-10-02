import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function App() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => {
        console.error('Error accessing camera:', err);
      });
  }, []);

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      const file = new File([blob], 'captured_image.png', { type: 'image/png' });
      setImage(URL.createObjectURL(file));
      handleImageUpload(file);
    }, 'image/png');
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDescription(response.data.description);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/images">Saved Images</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={
            <div>
              <h1>Image Captioning</h1>
              <video ref={videoRef} autoPlay style={{ width: '100%' }}></video>
              <button onClick={handleCapture}>Capture Photo</button>
              <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
              {image && <img src={image} alt="Captured" style={{ maxWidth: '100%' }} />}
              {description && <p>{description}</p>}
            </div>
          } />
          <Route path="/images" element={<SavedImages />} />
        </Routes>
      </div>
    </Router>
  );
}

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
      <h1>Saved Images</h1>
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

export default App;