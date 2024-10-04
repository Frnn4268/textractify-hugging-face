// src/components/ImageRow.jsx
import React from 'react';

const ImageRow = ({ image }) => {
  return (
    <tr>
      <td>{image.description}</td>
      <td><a href={image.audioPath} target="_blank" rel="noopener noreferrer">Listen</a></td>
      <td>
        <a href={image.imagePath} target="_blank" rel="noopener noreferrer">
          <img src={image.imagePath} alt={image.description} style={{ width: '100px', height: 'auto' }} />
        </a>
      </td>
    </tr>
  );
};

export default ImageRow;