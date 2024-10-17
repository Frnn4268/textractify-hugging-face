import React from 'react';
import axios from 'axios';
import './ImageTable.css'; 
import ImageRow from './ImageRow';

const ImageTable = ({ images, setImages }) => {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BACKEND_URL}/images/${id}`);
      setImages(images.filter(image => image._id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Audio URL</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {images.map((image) => (
          <ImageRow key={image._id} image={image} onDelete={handleDelete} />
        ))}
      </tbody>
    </table>
  );
};

export default ImageTable;