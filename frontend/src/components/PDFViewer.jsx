import React, { useRef, useState, useEffect } from "react";
import { useCreateIframeAndLoadViewer } from "@prodfox/react-ui-plugin";

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
      <div className="card">
      <div className="card-header text-center text-white" style={{ backgroundColor: 'rgb(40, 40, 40)' }}>
          <h4>PDF Viewer</h4>
        </div>

        <div className="card-body">
          {/* File Upload Section */}
          <div className="mb-3 text-center">
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
              className="form-control"
              style={{ maxWidth: "300px", margin: "auto" }}
            />
          </div>

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
                Please upload a PDF file to view
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
          className="text-justify mt-3 p-3"
          dangerouslySetInnerHTML={{
            __html: description.description_full || "Default Full Description",
          }}
        />
        {/* Card Footer */}
      </div>
      <br/><br/>
    </div>
  );
}

export default PDFViewer;
