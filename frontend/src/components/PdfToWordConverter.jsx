import React, { useState } from 'react';
import { Document, Packer, Paragraph } from 'docx';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker src to use the CDN version
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs';

const PdfToWordConverter = () => {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const convertPdfToWord = async () => {
    if (!pdfFile) {
      alert('Please upload a PDF file first.');
      return;
    }

    try {
      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const numPages = pdfDoc.numPages;
          const textPages = [];

          for (let i = 1; i <= numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            textPages.push(pageText);
          }

          // Convert text content to Word document
          const doc = new Document();
          textPages.forEach((pageText, index) => {
            doc.addSection({
              properties: {},
              children: [
                new Paragraph({
                  text: pageText,
                  heading: index === 0 ? 'Title' : undefined,
                }),
              ],
            });
          });

          // Generate DOCX file
          const blob = await Packer.toBlob(doc);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'output.docx');
          document.body.appendChild(link);
          link.click();
          link.remove();

          alert('PDF converted to Word file successfully.');
        } catch (error) {
          console.error('Error converting PDF to Word:', error);
          alert('Error converting PDF to Word.');
        }
      };

      fileReader.readAsArrayBuffer(pdfFile);
    } catch (error) {
      console.error('Error converting PDF to Word:', error);
      alert('Error converting PDF to Word.');
    }
  };

  return (
    <div>
      <h1>PDF to Word Converter</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={convertPdfToWord}>Convert to Word</button>
    </div>
  );
};

export default PdfToWordConverter;
