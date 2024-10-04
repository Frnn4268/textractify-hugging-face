import React from 'react';
import ImageRow from './ImageRow';

const ImageTable = ({ images }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Audio URL</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {images.map((image) => (
          <ImageRow key={image._id} image={image} />
        ))}
      </tbody>
    </table>
  );
};

export default ImageTable;