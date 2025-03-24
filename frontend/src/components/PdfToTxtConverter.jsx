import React, { useState, useEffect } from "react";
import axios from "/config/axiosConfig";
import loaderImage from "../assets/loadergif.gif";
import "../components/css/PDFtoText.css";

function PdfToTxtConverter({ description }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isFileSelected, setIsFileSelected] = useState(false);

  // Handle file input change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setErrorMessage("");
    setIsFileSelected(true);
    setCountdown(10); // Reset countdown
    setIsLoading(false); // Reset loading state
  };

  // Validate file
  const validateFile = (uploadedFile) => {
    const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();
    if (fileExtension !== "pdf") {
      setErrorMessage("Please upload a valid PDF file.");
      setIsLoading(false);
      return false;
    }
    return true;
  };

  // Upload file and convert
  const handleFileUpload = async () => {
    if (!file || !validateFile(file)) return;

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "/public/convert-pdf-to-txt",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "converted_file.txt");
      document.body.appendChild(link);
      link.click();

      setLoading(false);
      setIsLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage("Error during conversion. Please try again.");
      setIsLoading(false);
    }
  };

  // Countdown and auto-upload
  useEffect(() => {
    if (file && isLoading) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            handleFileUpload();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [file, isLoading]);

  return (
    <div>
      <div className="tools container-1060" style={{ minHeight: "100vh" }}>
        <div className="tools-top">
          <div className="tools-top__headlines">
            <h2 className="title">PDF To Text</h2>
          </div>

          {/* Loader with countdown */}
          {(loading || isLoading) && (
            <div className="loading">
              <img src={loaderImage} alt="Loading..." />
              {isLoading && (
                <center>
                  <p>Uploading in {countdown} seconds...</p>
                </center>
              )}
            </div>
          )}

          <div className="upload_group">
            <form onSubmit={(e) => e.preventDefault()}>
              <div
                className="upload-area text-center mt-3"
                onClick={() => document.getElementById("upload").click()}
              >
                <p className="upload-instruction">
                  Convert your PDF to a text file in seconds.
                </p>

                <div className="btn_group text-center">
                  <label htmlFor="upload">Select PDF file</label>
                  <input
                    type="file"
                    id="upload"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={isFileSelected}
                  />
                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}
                </div>
              </div>

              {/* File preview */}
              {file && (
                <div className="file-preview">
                  <h4>{file.name}</h4>
                  <iframe
                    src={URL.createObjectURL(file)}
                    width="100%"
                    height="600px"
                    title={`PDF Preview - ${file.name}`}
                  />
                </div>
              )}
              <br />

              {/* Convert Button */}
              {isFileSelected && !loading && !isLoading && (
                <center>
                  <div className="btn-group text-center mt-3">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setIsLoading(true);
                        setCountdown(5); // Reset countdown before starting
                      }}
                      disabled={isLoading || !file}
                    >
                      Convert to TXT
                    </button>
                  </div>
                </center>
              )}

              {/* Description Section */}
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
                className="text-justify mt-3" style={{ textAlign: "justify"}}
                dangerouslySetInnerHTML={{
                  __html:
                    description.description_full ||
                    "Default Full Description",
                }}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdfToTxtConverter;
