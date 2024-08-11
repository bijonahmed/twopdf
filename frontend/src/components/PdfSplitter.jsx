import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const PdfSplitter = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const splitPdf = async () => {
    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }

    const fileArrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(fileArrayBuffer);
    const numPages = pdf.getPageCount();

    for (let i = 0; i < numPages; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `page_${i + 1}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <button onClick={splitPdf}>Split PDF</button>
    </div>
  );
};

export default PdfSplitter;
