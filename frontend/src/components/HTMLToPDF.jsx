import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import DOMPurify from "dompurify";
import "../components/css/htmltopdf.css";
import PDFTools from "../components/PDFTools.jsx";

const HTMLToPDF = ({ description }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const pdfRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "text/html") {
      alert("Only HTML files are allowed!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const sanitizedHtml = DOMPurify.sanitize(event.target.result);
      setHtmlContent(sanitizedHtml);
      setShowModal(true);
    };
    reader.readAsText(file);
  };

  const handleConvertToPDF = () => {
    if (!htmlContent) {
      alert("No HTML content available to convert to PDF.");
      return;
    }

    setIsLoading(true);

    const element = pdfRef.current;

    const options = {
      margin: 10,
      filename: "converted-file.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        setIsLoading(false);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-12"> 
          <div className="card-header text-center">
            <div className="tools-top__headlines">
              <h2 className="title">Upload HTML & Convert to PDF</h2>
            </div>
          </div>

      <div className="upload-area text-center mt-3">
        <label htmlFor="upload" className="btn btn-primary" onClick={() => document.getElementById("upload").click()}>
          Select HTML
        </label>
          <input
            id="upload"
            type="file"
            accept=".html"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          {isLoading && (
            <div className="loading text-center mb-3">
              <p>Converting to PDF, please wait...</p>
            </div>
          )}
        </div>


          {htmlContent && (
            <div
              ref={pdfRef}
              className="uploaded-html-container"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}

          <div className="card-footer text-center">
            <button
              onClick={handleConvertToPDF}
              disabled={!htmlContent || isLoading}
              className="btn btn-primary w-100"
            >
              {isLoading ? "Converting..." : "Convert to PDF"}
            </button>
          </div>
          <div className="container mt-lg-4">
            <PDFTools />
          </div>
          
          <h1>
            <br />
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
            className="text-justify mt-3 p-3" style={{ textAlign: 'justify' }}
            dangerouslySetInnerHTML={{
              __html:
                description.description_full || "Default Full Description",
            }}
          />
        
      </div>
    </div>
         
    <br />
    {showModal && (
      <div
        className="modal fade show"
        tabIndex="-1"
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">HTML Content Preview</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConvertToPDF}
              >
                Convert to PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default HTMLToPDF;
