// PDFZipUpload.jsx
import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';

const PDFZipUpload = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const compressPDF = async (file) => {
    // Load the PDF
    const pdfDoc = await PDFDocument.load(await file.arrayBuffer());

    // Compress PDF (In this example, we don't actually compress. Just re-save)
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  };

  const handleUpload = async () => {
    const zip = new JSZip();

    for (const file of files) {
      if (file.type === 'application/pdf') {
        const compressedPDF = await compressPDF(file);
        zip.file(file.name, compressedPDF);
      } else {
        alert('Please upload only PDF files.');
        return;
      }
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'pdf-files.zip');
    });
  };

  return (
    <div>
      <input type="file" accept="application/pdf" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Zip PDFs</button>
    </div>
  );
};

export default PDFZipUpload;
