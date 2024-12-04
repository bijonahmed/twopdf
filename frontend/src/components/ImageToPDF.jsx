import React, { useState, useEffect } from 'react';
import loaderImage from "../assets/loadergif.gif";
import jsPDF from 'jspdf';

const ImageToPDF = () => {
  const [image, setImage] = useState(null); // Store the selected image
  const [isLoading, setIsLoading] = useState(false); // To control the loading state
  const [countdown, setCountdown] = useState(5); // Countdown time

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the first image file
    setIsLoading(true); // Start loading
    setCountdown(5); // Reset countdown
    setImage(null); // Clear previous image

    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the image source to be used for PDF
      };
      reader.readAsDataURL(file); // Read the image file
    } else {
      alert('Please upload a valid image.');
      setIsLoading(false); // Stop loading if file is not an image
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
      pdf.save('generated.pdf'); // Save the generated PDF
      setIsLoading(false); // Stop loading when PDF is saved
    };

    img.onerror = () => {
      alert('Error loading the image.');
      setIsLoading(false); // Stop loading if error occurs
    };
  };

  // Automatically trigger PDF generation after countdown
  useEffect(() => {
    if (isLoading && image) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            handleGeneratePDF(); // Trigger PDF generation after countdown finishes
            setCountdown(0); // Set countdown to 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup when countdown finishes
    }
  }, [image, isLoading]); // Trigger effect when image or loading state changes

  return (

    <div className="tools container-1060" style={{ minHeight: '100vh' }}>
  <div className="tools-top">
    <div className="tools-top__headlines">
      <h2 className="title">Image to PDF</h2>
      <p className="subtitle">
        Convert your Image to a PDF file in seconds.
      </p>
    </div>

    <div style={{ padding: '20px', textAlign: 'center' }}>
      {isLoading && (
        <div className="loading" style={{ marginBottom: '20px' }}>
          <img src={loaderImage} alt="Loading..." />
          <p>Uploading in {countdown} seconds...</p>
        </div>
      )}

      {/* File input for image upload */}
      <div className="upload_group">
        <div className="btn_group">
          <label htmlFor="upload">Select an Image</label>
          <input
            type="file"
            id="upload"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ margin: '20px 0', padding: '10px' }}
          />
        </div>
      </div>

      {/* Display uploaded image */}
      {image && (
        <div>
          <img
            src={image}
            alt="Uploaded"
            style={{
              width: '300px', // Adjusted width for better view
              height: 'auto',
              margin: '10px 0',
              borderRadius: '10px', // Rounded corners for the image
              border: '2px solid #4CAF50', // Green border for the image
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)', // Subtle shadow around the image
              transition: 'transform 0.3s ease', // Smooth transition for hover effect
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)'; // Slight zoom on hover
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)'; // Reset zoom on mouse out
            }}
          />
        </div>
      )}

      {/* Button to generate PDF */}
      <button
        onClick={handleGeneratePDF}
        disabled={isLoading || !image} // Disable button while loading or no image
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          marginTop: '20px',
          borderRadius: '5px', // Rounded corners for the button
          fontWeight: 'bold', // Make the text bold
        }}
      >
        {isLoading ? 'Generating PDF...' : 'Generate PDF'}
      </button>
    </div>
  </div>
</div>

  );
};

export default ImageToPDF;
