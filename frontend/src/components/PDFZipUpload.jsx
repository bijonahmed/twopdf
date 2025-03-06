import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import loaderImage from "../assets/loadergif.gif";

const PDFZipUpload = ({ description }) => {
  const [files, setFiles] = useState([]); // Store multiple files
  const [isLoading, setIsLoading] = useState(false); // To control the loading state
  const [countdown, setCountdown] = useState(5); // Countdown time

  const handleFileChange = (event) => {
    setFiles(event.target.files); // Store multiple files from input
    // setIsLoading(true); // Start loading
    // setCountdown(5); // Reset countdown
  };

  const compressPDF = async (file) => {
    // Load the PDF file from the file input
    const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
    // Save the PDF (no actual compression logic in this example)
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });
  };

  const handleUpload = async () => {
    setIsLoading(true); // Start loading when the upload begins
    const zip = new JSZip();

    for (const file of files) {
      if (file.type === "application/pdf") {
        // Compress the PDF and add it to the zip
        const compressedPDF = await compressPDF(file);
        zip.file(file.name, compressedPDF);
      } else {
        alert("Please upload only PDF files.");
        setIsLoading(false); // Stop loading if non-PDF files are found
        return;
      }
    }

    // Generate the zip file asynchronously
    zip.generateAsync({ type: "blob" }).then((content) => {
      // Save the zip file to the user's computer
      saveAs(content, "pdf-files.zip");
      setIsLoading(false); // Stop loading when the ZIP is ready
    });
  };

  // Automatically trigger upload after countdown
  useEffect(() => {
    if (isLoading && files.length > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            handleUpload(); // Trigger file upload after countdown finishes
            setCountdown(0); // Set countdown to 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup when file changes or countdown finishes
    }
  }, [files, isLoading]); // Trigger effect when files or loading state changes

  return (
    <div className="tools container-1060" style={{ minHeight: "100vh" }}>
      <div className="tools-top">
        <div className="tools-top__headlines">
          <h2 className="title">Multiple PDF to ZIP</h2>
          <p className="subtitle">Convert your PDF to a ZIP file in seconds.</p>
        </div>

        {isLoading && (
          <div className="loading">
            <img src={loaderImage} alt="Loading..." />
            <center>
              <p>Uploading in {countdown} seconds...</p>
            </center>
          </div>
        )}

        <div className="upload_group">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="btn_group text-center">
              <label htmlFor="upload">Select PDF files</label>
              <input
                type="file"
                id="upload"
                multiple
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </div>
            <br />

            {/* PDF Previews */}
            <div className="pdf-previews">
              {files.length > 0 && (
                <div>
                  <div className="row">
                    {Array.from(files).map((file, index) => {
                      const fileURL = URL.createObjectURL(file);
                      return (
                        <div key={index} className="col-md-5 mb-4">
                          <div className="pdf-preview">
                            <p>{file.name}</p>
                            {/* You can display the PDF using iframe */}
                            <iframe
                              src={fileURL}
                              width="100%"
                              height="400px"
                              title={`PDF Preview - ${file.name}`}
                            ></iframe>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <center>
              <div className="btn-group text-center mt-3">
                <button
                  type="button"
                  className="btn"
                  onClick={handleUpload}
                  disabled={isLoading || files.length === 0}
                >
                  Create ZIP
                </button>
                <br />
              </div>
            </center>
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
              className="text-justify mt-3"
              dangerouslySetInnerHTML={{
                __html:
                  description.description_full || "Default Full Description",
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PDFZipUpload;
