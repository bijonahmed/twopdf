import React, { useRef, useState, useEffect } from "react";
import { useCreateIframeAndLoadViewer } from "@prodfox/react-ui-plugin";
import "../components/css/documentViewer.css";
import PDFTools from "../components/PDFTools.jsx";

function PDFViewer({ description }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [viewerReady, setViewerReady] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]); // Initialize as empty array

  const { download } = useCreateIframeAndLoadViewer({
    container: containerRef,
    fileName: "my-file.pdf",
    uuid: "some-user",
    licenseKey: "sandbox",
    locale: "en",
    tools: {
      editing: ["extract", "remove", "move"],
      thumbnails: ["zoom", "expand"],
      general: ["thumbnails", "download", "search", "panel-toggle", "zoom"],
    },
    files: files, // Using dynamic files array
    onReady: () => {
      console.log("PDF Viewer is ready");
      setLoading(false);
      setViewerReady(true);
    },
    onError: (err) => {
      console.error("Viewer load error:", err);
      setLoading(false);
      setError("Failed to load PDF viewer.");
    },
  });

  // Handle file change event
  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files); // Convert FileList to array
    const newFiles = uploadedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setFiles(newFiles); // Set multiple files in the state
  };

  const handleDownload = () => {
    if (viewerReady) {
      download();
    } else {
      setError("Viewer is not ready yet.");
    }
  };

  return (
    <div className="container mt-5">
      {/* Bootstrap Card Component */}
      <div className="">
      <div className="text-center text-black">
         <div className="tools-top__headlines">
          <h2 className="title">Document Viewer</h2>
        </div>
        </div>

        <div className="upload-area text-center mt-3" onClick={() => document.getElementById("pdfUpload").click()}>
        <p className="upload-instruction">   Please upload a PDF file to view</p>



        <label htmlFor="upload" className="btn btn-primary">
          Select PDFs
        </label>
        <input
          type="file"
          id="pdfUpload"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
       
          {/* Display error message if exists */}
          {error && (
            <div
              className="alert alert-danger text-center"
              style={{ fontSize: "14px" }}
            >
              {error}
            </div>
          )}

          {/* PDF Viewer Container */}
          <div className="container">
            {files.length === 0 ? (
              <div
                className="text-center text-muted"
                style={{ fontSize: "16px" }}
              >
             
              </div>
            ) : (
              <div
                className="container"
                id="pdf"
                ref={containerRef}
                style={{
                  margin: "0",
                  border: "1px solid #ccc",
                  height: "700px", // Adjusted for better view
                  width: "100%",
                  marginBottom: "20px",
                }}
              ></div>
            )}
          </div>
        </div>
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
          className="text-justify mt-3 p-3" style={{ textAlign: 'justify'}}
          dangerouslySetInnerHTML={{
            __html: description.description_full || "Default Full Description",
          }}
        />
        {/* Card Footer */}
      </div>


      <div className="container mt-lg-4">
            <PDFTools />
          </div>


      <br/><br/>
    </div>
  );
}

export default PDFViewer;
