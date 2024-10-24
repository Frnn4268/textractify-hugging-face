import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
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

  // UseEffect to get access to the camera stream 
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

  // Function to show a SweetAlert
  const showLoadingAlert = () => {
    Swal.fire({
      title: 'Capturing!',
      html: 'Please wait while we process your image...',
      timerProgressBar: true,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  // Function to handle capturing a photo
  const handleCapture = () => {
    showLoadingAlert(); 

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

  // Function to upload the captured image to the backend
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

      Swal.fire({
        icon: 'success',
        title: 'Image Captured!',
        text: 'The image has been processed successfully.',
        confirmButtonText: 'Awesome!',
      });

    } catch (error) {
      console.error('Error uploading image:', error);

      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'There was an error processing the image. Please try again.',
        confirmButtonText: 'Got it',
      });
    }
  };

  const toggleCamera = () => {
    setUseFrontCamera(prevState => !prevState);

    Swal.fire({
      icon: 'info',
      title: 'Camera Switched!',
      text: useFrontCamera ? 'You are now using the rear camera' : 'You are now using the front camera',
      confirmButtonText: 'OK',
    });
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
