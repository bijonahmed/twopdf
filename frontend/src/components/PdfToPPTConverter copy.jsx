import React, { useState } from "react";
import axios from "/config/axiosConfig"; // Make sure to configure axios
import loaderImage from "../assets/loadergif.gif";

function PdfToPPTConverter({ description }) {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pptFile, setPptFile] = useState(null);
  const [countdown, setCountdown] = useState(5);
  // Handle file input change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setPreviewURL(URL.createObjectURL(selectedFile));
      setErrorMessage("");
      setPptFile(null); // Reset previous converted file
    } else {
      setFile(null);
      setPreviewURL(null);
    }
  };

  // Validate the file to ensure it's a PDF
  const validateFile = (uploadedFile) => {
    const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();
    if (fileExtension !== "pdf") {
      setErrorMessage("Please upload a valid PDF file.");
      return false;
    }
    return true;
  };

  // Handle the file upload and PDF-to-PPT conversion
  const handleFileUpload = async () => {
    if (!file) {
      setErrorMessage("No file selected.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Call Laravel API to convert PDF to PPT
      const response = await axios.post(
        "/public/convert-pdf-to-ppt",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      // Create a downloadable link for the converted PPT file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setPptFile(url);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage("Error during conversion. Please try again.");
    }
  };

  return (
    <div
    className="tools container-1060"
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f9f9f9",
      padding: "20px",
    }}
  >
    <div
      className="tools-top">
      <h2
        className="title"
        style={{ color: "#333", fontSize: "24px", marginBottom: "10px" }}
      >
        PDF To PPT
      </h2>
      <p className="subtitle" style={{ color: "#666", fontSize: "16px" }}>
        Convert your PDF to a PPT file in seconds.
      </p>
  
      <div className="upload_group" style={{ marginTop: "20px" }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="btn_group text-center">
            <label
              htmlFor="upload"
              className="upload-label"
              style={{
                display: "inline-block",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Select PDF file
            </label>
            <input
              type="file"
              id="upload"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {errorMessage && (
              <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
            )}
          </div>
        </form>
      </div>
  
      {/* PDF Preview */}
      {previewURL && (
        <div
          className="pdf-preview"
          style={{
            width: "100%",
            marginTop: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <iframe
            src={previewURL}
            width="100%"
            height="700px"
            style={{ border: "none" }}
          />
        </div>
      )}
  
      {/* Convert Button */}
      {file && (
        <div className="convert-section" style={{ marginTop: "20px" }}>
          <button
            onClick={handleFileUpload}
            disabled={loading}
            className="convert-btn"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              color: "#fff",
              backgroundColor: loading ? "#aaa" : "#28a745",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? (
              <div className="loading">
                <img
                  src={loaderImage}
                  alt="Loading..."
                  style={{ width: "30px", verticalAlign: "middle" }}
                />
                <span style={{ marginLeft: "10px" }}>
                  Uploading in {countdown} seconds...
                </span>
              </div>
            ) : (
              "Convert to PPT"
            )}
          </button>
        </div>
      )}
  
      {/* Download PPT Link */}
      {pptFile && (
        <div className="download-section" style={{ marginTop: "20px" }}>
          <p style={{ color: "#28a745", fontWeight: "bold" }}>
            Your PowerPoint is ready!
          </p>
          <a
            href={pptFile}
            download="converted_presentation.pptx"
            className="download-btn"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: "5px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Download PPT
          </a>
        </div>
      )}
  
      <h1 style={{ marginTop: "20px" }}>
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
          __html: description.description_full || "Default Full Description",
        }}
        style={{ marginTop: "10px", color: "#555", fontSize: "14px" }}
      />
    </div>
  </div>
  
  );
}

export default PdfToPPTConverter;
