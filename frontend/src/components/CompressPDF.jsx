import React, { useState } from "react";
import * as pdfLib from "pdf-lib";

const CompressPDF = ({description}) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [compressedPdfUrl, setCompressedPdfUrl] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null); // State for iframe preview

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed!");
      return;
    }

    setPdfFile(file);

    // Create a URL for the uploaded PDF to be used in the iframe
    const url = URL.createObjectURL(file);
    setPdfPreviewUrl(url);
  };

  // Compress PDF function
  const handleCompressPDF = async () => {
    if (!pdfFile) return;

    setIsLoading(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await pdfLib.PDFDocument.load(arrayBuffer);

      // Simplifying and removing unused objects from the document
      pdfDoc.getPages().forEach((page) => {
        // Here you can optimize and clean up elements (e.g., reduce complexity)
        // This is a basic operation; more complex image compression requires specialized tools
      });

      // Save the reduced PDF with useObjectStreams enabled for better compression
      const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });

      // Create a blob from the compressed PDF
      const blob = new Blob([compressedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setCompressedPdfUrl(url);
    } catch (error) {
      console.error("Compression error:", error);
      alert("Failed to compress PDF.");
    }

    setIsLoading(false);
  };

  return (
    <div className="container mt-5">
    <div className="card shadow-lg">
      <div className="card-body">
        {/* Title Section */}
        <h1>
          <center><div
            className="text-justify"
            dangerouslySetInnerHTML={{
              __html: description.meta_title || "Default Meta Title",
            }}
          /></center>
        </h1>

        {/* File Upload Section */}
        <div className="mb-4">
         
          <input
            id="pdfUpload"
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="form-control"
          />
        </div>

        {/* PDF Preview in an iframe */}
        {pdfPreviewUrl && (
          <div className="mb-3">
            <iframe
              src={pdfPreviewUrl}
              width="100%"
              height="500px"
              title="PDF Preview"
              style={{ border: "none" }}
            ></iframe>
          </div>
        )}

        {/* Compress PDF Button */}
        <div className="mb-3">
          <button
            onClick={handleCompressPDF}
            className="btn btn-primary w-100"
            disabled={!pdfFile || isLoading}
          >
            {isLoading ? "Compressing..." : "Compress PDF"}
          </button>
        </div>

        {/* Link to download the compressed PDF */}
        {compressedPdfUrl && (
          <div className="mb-3">
            <a
              href={compressedPdfUrl}
              download="compressed.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success w-100"
            >
              Download Compressed PDF
            </a>
          </div>
        )}

        {/* Full Description */}
        <div
          className="text-justify mt-3"
          dangerouslySetInnerHTML={{
            __html: description.description_full || "Default Full Description",
          }}
        />

      </div>

    </div>
    <br/> <br/>
  </div>







  );
};

export default CompressPDF;
