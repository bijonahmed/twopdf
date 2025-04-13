import React, { useState } from "react";
import mammoth from "mammoth";
import html2pdf from "html2pdf.js"; // Import html2pdf.js library
import "../components/css/WordtoPDF.css";
import PDFTools from "../components/PDFTools.jsx";

const WordToHTML = ({ description }) => {
  const [htmlContent, setHtmlContent] = useState(""); // Store HTML content
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [docFile, setDocFile] = useState(null); // Store selected file

  // Handle DOCX file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setDocFile(file); // Set the selected file
    setHtmlContent(""); // Clear previous content
  };

  // Handle DOCX to HTML conversion
  const handleGenerateHTML = () => {
    if (!docFile) {
      alert("Please select a DOCX file first.");
      return;
    }

    setIsLoading(true); // Start loading

    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      convertDocxToHtml(arrayBuffer); // Convert DOCX to HTML
    };
    reader.readAsArrayBuffer(docFile); // Read file as ArrayBuffer
  };

  // Function to convert DOCX to HTML using Mammoth
  const convertDocxToHtml = (arrayBuffer) => {
    mammoth
      .convertToHtml({ arrayBuffer })
      .then((result) => {
        setHtmlContent(result.value); // Set HTML content
        setIsLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error("Error converting DOCX to HTML:", error);
        setIsLoading(false); // Stop loading on error
      });
  };

  // Export the HTML content as an HTML file
  const handleExportHTML = () => {
    if (!htmlContent) {
      alert("No HTML content available to export.");
      return;
    }

    // Create a Blob from the HTML content
    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");

    // Create a URL for the Blob and trigger a download
    link.href = URL.createObjectURL(blob);
    link.download = "converted-file.html"; // Set file name
    link.click();
  };

  // Convert HTML to PDF and download it using html2pdf.js
  const handleConvertToPDF = () => {
    if (!htmlContent) {
      alert("No HTML content available to convert to PDF.");
      return;
    }

    // Create a container div for the HTML content
    const container = document.createElement("div");
    container.innerHTML = htmlContent;

    // Configure html2pdf options
    const options = {
      margin: 10,
      filename: "converted-file.pdf",
      html2canvas: { scale: 2 }, // Higher scale for better quality
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Use html2pdf.js to convert the HTML content to PDF
    html2pdf().from(container).set(options).save();
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="tools-top__headlines">
            <h2 className="title">Convert DOCX to PDF & HTML</h2>
          </div>

          {/* Display selected file name */}
          {docFile && (
            <div className="alert alert-info text-center mt-3">
              <strong>Selected File:</strong> {docFile.name}
            </div>
          )}

          {/* Upload Section */}
          <div
            className="upload-area text-center mt-3"
            onClick={() => document.getElementById("pdfUpload").click()}
          >
            <div className="card-body">
              <div className="text-center">
                {isLoading && <p>Loading... Please wait</p>}

                <label htmlFor="upload" className="btn btn-primary">
                  Select DOCX
                </label>
                <input
                  type="file"
                  id="pdfUpload"
                  accept=".docx"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>

          {/* Convert Button */}
          <button
            onClick={handleGenerateHTML}
            disabled={isLoading || !docFile}
            className="btn btn-success btn-block mt-3 w-100"
          >
            {isLoading ? "Generating..." : "Generate Preview"}
          </button>

          {/* Display Converted HTML Content */}
          <div className="upload-area text-center mt-3">
            {htmlContent && (
              <div
                style={{
                  padding: "20px",
                  border: "1px solid #ccc",
                  maxHeight: "300px",
                  overflowY: "auto",
                  marginTop: "20px",
                }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              ></div>
            )}

            <br />
            <div className="text-center">
              <div className="row">
                {/* Export to HTML Button */}
                <div className="col-md-5 mb-2">
                  <button
                    onClick={handleExportHTML}
                    disabled={!htmlContent}
                    className="btn btn-danger btn-block w-100"
                  >
                    Export to HTML
                  </button>
                </div>

                {/* Convert to PDF Button */}
                <div className="col-md-5 mb-2">
                  <button
                    onClick={handleConvertToPDF}
                    disabled={!htmlContent}
                    className="btn btn-primary btn-block w-100"
                  >
                    Convert to PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Meta Title & Description */}
          <div className="container mt-lg-4">
            <PDFTools />
          </div>
          <br/>
          <h1>
            <center>
              <div
                className="text-justify"
                dangerouslySetInnerHTML={{
                  __html: description.meta_title || "Default Meta Title",
                }}
              />
            </center>
          </h1>
          <div
            className="text-justify mt-3 p-2"
            style={{ textAlign: "justify" }}
            dangerouslySetInnerHTML={{
              __html:
                description.description_full || "Default Full Description",
            }}
          />

          
        </div>
      </div>
    </div>
  );
};

export default WordToHTML;