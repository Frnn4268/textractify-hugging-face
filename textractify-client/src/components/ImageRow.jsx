// src/components/ImageRow.jsx
import React from 'react';

const ImageRow = ({ image }) => {
  return (
    <tr>
      <td>{image.description}</td>
      <td><a href={image.audioPath} target="_blank" rel="noopener noreferrer">Listen</a></td>
    </tr>
  );
};

export default ImageRow;