import React from 'react';
import './ImageRow.css'; 


const ImageRow = ({ image, onDelete }) => {
  return (
    <tr>
      <td>{image.description}</td>
      <td><a href={image.audioPath} target="_blank" rel="noopener noreferrer">Listen</a></td>
      <td><a href={image.translatedAudioPath} target="_blank" rel="noopener noreferrer">Listen</a></td>
      <td>
        <a href={image.imagePath} target="_blank" rel="noopener noreferrer">
          <img src={image.imagePath} alt={image.description} style={{ width: '100px', height: 'auto' }} />
        </a>
      </td>
      <td>
        <button onClick={() => onDelete(image._id)}>Delete</button>
      </td>
    </tr>
  );
};

export default ImageRow;