import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import loaderImage from "../assets/loadergif.gif";

const HTMLToPDF = ({ description }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(10);
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
      setHtmlContent(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleConvertToPDF = () => {
    if (!htmlContent) {
      alert("No HTML content available to convert to PDF.");
      return;
    }

    setIsLoading(true); // Show loader
    setCountdown(10); // Reset countdown to 10 seconds

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(countdownInterval); // Clear interval when countdown reaches 0
        }
        return prevCountdown - 1;
      });
    }, 1000);

    const options = {
      margin: [10, 10], // Ensure there is space for content
      filename: "converted-file.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 3, // Increase the scale factor for better resolution
        useCORS: true,
        allowTaint: true,
        logging: true, // Enable logging for debugging
        width: 800, // Adjust to ensure content fits within PDF page
        height: 8000, // Adjust the height if the content is large
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(options)
      .from(pdfRef.current)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        let totalPages = pdf.internal.getNumberOfPages();
        if (totalPages > 1) {
          // Handling multiple pages if there are too many content
          pdf.deletePage(1); // Example: delete first page if not needed
        }
        pdf.save(); // Save the generated PDF
      })
      .finally(() => {
        setIsLoading(false); // Hide loader after conversion
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-center">
              <h2>Upload HTML & Convert to PDF</h2>
            </div>
            <div className="card-body">
              <input
                type="file"
                accept=".html"
                onChange={handleFileUpload}
                className="form-control mb-3"
              />

              {/* Loader Section */}
              {isLoading && (
                <div className="loading" style={{ textAlign: "center" }}>
                  <img src={loaderImage} alt="Loading..." width="50" />
                  <p>Please wait {countdown} seconds.</p>
                </div>
              )}
            </div>

            {htmlContent && (
              <div
                ref={pdfRef}
                dangerouslySetInnerHTML={{
                  __html: `
                    <style>
                      * { font-family: Arial, sans-serif; }
                      .iframe-placeholder {
                        background-color: #f1f1f1;
                        text-align: center;
                        padding: 20px;
                        font-size: 16px;
                        border: 1px dashed #ccc;
                      }

                      /* Page Break */
                      .page-break { 
                        page-break-before: always; 
                        page-break-inside: avoid;
                      }

                      /* Prevent overflow issues */
                      .container {
                        overflow: auto;
                      }

                      .welcome-container {
                        background: #e9f7f7;
                        padding: 20px;
                        margin-bottom: 20px;
                      }

                      .button {
                        background-color: #008CBA;
                        color: white;
                        padding: 10px 20px;
                        text-align: center;
                        border: none;
                        cursor: pointer;
                      }

                      .button:hover {
                        background-color: #005f73;
                      }

                      /* Force page breaks */
                      .page-break {
                        page-break-before: always;
                      }
                    </style>
                    ${htmlContent.replace(/<iframe[^>]*>(.*?)<\/iframe>/g, (match) => {
                      return `<div class="iframe-placeholder">Iframe content is not supported in PDF. View it at the following URL: [URL]</div>`;
                    })}
                  `,
                }}
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
          </div>
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default HTMLToPDF;
