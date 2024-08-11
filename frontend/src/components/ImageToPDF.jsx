import React, { useState } from 'react';
import jsPDF from 'jspdf';

const ImageToPDF = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePDF = () => {
    if (!image) {
      alert('Please upload an image first.');
      return;
    }

    const pdf = new jsPDF();
    const img = new Image();
    img.src = image;

    img.onload = () => {
      // Calculate the dimensions of the image for the PDF
      const imgWidth = 180; // Adjust the width as needed
      const imgHeight = (img.height * imgWidth) / img.width;

      pdf.addImage(img, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('generated.pdf');
    };

    img.onerror = () => {
      alert('Error loading the image.');
    };
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={image} alt="Uploaded" style={{ width: '200px', height: 'auto', margin: '10px 0' }} />}
      <button onClick={handleGeneratePDF}>Generate PDF</button>
    </div>
  );
};

export default ImageToPDF;
