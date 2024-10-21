import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ImageCapture.css'; 

function ImageCapture() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [audioUrl, setAudioUrl] = useState(''); 
  const [translatedAudioUrl, setTranslatedAudioUrl] = useState('');
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const getCameraStream = async () => {
      const constraints = {
        video: {
          facingMode: useFrontCamera ? 'user' : 'environment'
        }
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    getCameraStream();
  }, [useFrontCamera]);

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
      setTranslatedText(response.data.translatedDescription);
      setAudioUrl(response.data.audioPath); 
      setTranslatedAudioUrl(response.data.translatedAudioPath);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const toggleCamera = () => {
    setUseFrontCamera(prevState => !prevState);
  };

  return (
    <div className="image-capture-container">
      <h1 className="title">Image Fun Time!</h1>
      <video ref={videoRef} autoPlay className="video-stream"></video>
      <div className="buttons-container">
        <button className="capture-button" onClick={handleCapture}>📸 Capture Photo</button>
        <button className="toggle-button" onClick={toggleCamera}>🔄 Switch Camera</button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
      {image && <img src={image} alt="Captured" className="captured-image" />}
      {description && <p className="description">{description}</p>}
      {translatedText && <p className="description">{translatedText}</p>}
      {audioUrl && <audio controls src={audioUrl} className="audio-player"></audio>} 
      {translatedAudioUrl && <audio controls src={translatedAudioUrl} className="audio-player"></audio>} 
    </div>
  );
}

export default ImageCapture;
