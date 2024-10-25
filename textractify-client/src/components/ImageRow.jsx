import React from 'react';
import Swal from 'sweetalert2';
import './ImageRow.css'; 

const ImageRow = ({ image, onDelete }) => {
  
  // Function to show confirmation before deleting an image
  const handleDeleteClick = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the onDelete function to delete the image
        onDelete(id);
        
        // Show success message after deletion
        Swal.fire(
          'Deleted!',
          'Your image has been deleted.',
          'success'
        );
      }
    });
  };

  return (
    <tr>
      <td>{image.description}</td>
      <td>{image.translatedDescription}</td>
      <td><a href={image.audioPath} target="_blank" rel="noopener noreferrer">Listen</a></td>
      <td><a href={image.translatedAudioPath} target="_blank" rel="noopener noreferrer">Listen</a></td>
      <td>
        <a href={image.imagePath} target="_blank" rel="noopener noreferrer">
          <img src={image.imagePath} alt={image.description} style={{ width: '100px', height: 'auto' }} />
        </a>
      </td>
      <td>
        <button onClick={() => handleDeleteClick(image._id)}>Delete</button>
      </td>
    </tr>
  );
};

export default ImageRow;
