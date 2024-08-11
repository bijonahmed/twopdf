import React, { useState } from 'react';
import axios from 'axios';

const PdfCompressor = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const compressPdf = async () => {
    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Replace this URL with the API endpoint of the PDF compression service you are using
      const response = await axios.post('https://api.example.com/compress', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob' // Ensure the response is handled as a binary file
      });

      // Create a download link and trigger the download
      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compressed.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error compressing PDF:", error);
      alert("An error occurred while compressing the PDF.");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <button onClick={compressPdf}>Compress PDF</button>
    </div>
  );
};

export default PdfCompressor;
