import React, { useState } from "react";
import mammoth from "mammoth";
import html2pdf from "html2pdf.js"; // Import html2pdf.js library

const WordToHTML = ({ description }) => {
  const [htmlContent, setHtmlContent] = useState(""); // Store HTML content
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [docFile, setDocFile] = useState(null); // Store selected file

  // Handle DOCX file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setDocFile(file); // Set the selected file
    setHtmlContent(""); // Clear the previous content
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

    // Configure html2pdf options (optional adjustments for your needs)
    const options = {
      margin: 10,
      filename: "converted-file.pdf",
      html2canvas: { scale: 2 }, // Higher scale for better quality
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // PDF format and orientation
    };

    // Use html2pdf.js to convert the HTML content to PDF
    html2pdf().from(container).set(options).save(); // Trigger the PDF download
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          {/* Bootstrap Card Layout */}
          <div className="card">
            <div className="card-header text-center">
              <h2>Convert DOCX to PDF & HTML</h2>
            </div>
            <div className="card-body">
              {/* File input for DOCX upload */}
              <div className="text-center">
                {isLoading && <p>Loading... Please wait</p>}

                <input
                  type="file"
                  accept=".docx"
                  onChange={handleFileUpload}
                  className="form-control mb-3"
                />

                {/* Button to trigger DOCX to HTML conversion */}
                <button
                  onClick={handleGenerateHTML}
                  disabled={isLoading || !docFile} // Disable button if no file selected or during loading
                  className="btn btn-success btn-block mt-3 w-100"
                >
                  {isLoading ? "Generating..." : "Generate HTML"}
                </button>
              </div>
            </div>

            {/* Display the converted HTML content */}
            {htmlContent && (
              <div
                style={{
                  padding: "20px",
                  border: "1px solid #ccc",
                  maxHeight: "300px",
                  overflowY: "auto",
                  marginTop: "20px",
                }}
                dangerouslySetInnerHTML={{ __html: htmlContent }} // Render the HTML content
              ></div>
            )}

            <div className="card-footer text-center">
              <div className="row">
                {/* Left Column - Export to HTML Button */}
                <div className="col-md-5 mb-2">
                  <button
                    onClick={handleExportHTML}
                    disabled={!htmlContent} // Disable if no HTML content
                    className="btn btn-danger btn-block w-100"
                  >
                    Export to HTML
                  </button>
                </div>

                {/* Right Column - Convert to PDF Button */}
                <div className="col-md-5 mb-2">
                  <button
                    onClick={handleConvertToPDF}
                    disabled={!htmlContent} // Disable if no HTML content
                    className="btn btn-primary btn-block w-100"
                  >
                    Convert to PDF
                  </button>
                </div>
              </div>
            </div>

            <br />
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
              dangerouslySetInnerHTML={{
                __html:
                  description.description_full || "Default Full Description",
              }}
            />
          </div>
          <br />
        </div>
      </div>
    </div>
  );
};

export default WordToHTML;
