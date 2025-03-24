import React, { useState } from "react";
import axios from "/config/axiosConfig";
import "../components/css/watermarkPDF.css";
import "../components/css/WaterMarkWrapper.css";
const PDFUploadWithWatermark = ({ description }) => {
  const [files, setFiles] = useState([]);
  const [watermarkText, setWatermarkText] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [previewLinks, setPreviewLinks] = useState([]);
  const [watermarkTextPosition, setWatermarkTextPosition] = useState([]);
  const [downloadLink, setDownloadLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [watermarkFontSize, setWatermarkFontSize] = useState({});
  const [watermarkOpacity, setWatermarkOpacity] = useState([]); // Add state for opacity
  const [watermarkSettings, setWatermarkSettings] = useState([]);
  // Inline styling for left-side position
  const styles = {};
  // Handle file selection

  // Function to handle opacity change
  const handleWatermarkOpacityChange = (index, opacity) => {
    setWatermarkOpacity((prev) => {
      const updated = [...prev];
      updated[index] = opacity;
      return updated;
    });
  };

  const handleWatermarkFontSizeChange = (index, size) => {
    setWatermarkFontSize((prev) => ({ ...prev, [index]: size }));
  };
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };
  const handleWatermarkPositionChange = (index, position) => {
    const updatedPositions = [...watermarkTextPosition];
    updatedPositions[index] = position;
    setWatermarkTextPosition(updatedPositions);
  };
  // Handle watermark text input
  const handleWatermarkTextChange = (index, text) => {
    const newWatermarkText = [...watermarkText];
    newWatermarkText[index] = text;
    setWatermarkText(newWatermarkText);
  };

  // Handle PDF generation with watermark
  const handleGeneratePdf = async () => {
    setErrors({}); // Clear previous errors
    let validationErrors = {};

    if (watermarkTextPosition.length === 0) {
      Swal.fire({
        icon: "error",
        title:
          "The watermark position must be one of the following: top-left, top-right, bottom-left, bottom-right, center.",
        //text: "Please select file.",
      });
      return false;
    }

    if (watermarkFontSize.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Watermark font size is required.",
        //text: "Please select file.",
      });
      return false;
    }

    ///
    if (watermarkOpacity.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Watermark opacity is required.",
        //text: "Please select file.",
      });
      return false;
    }

    // Validate that files are uploaded and watermark text is provided
    if (files.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Please upload at least one PDF file",
        text: "Please select file.",
      });
    }

    if (!watermarkFontSize || watermarkFontSize.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Please select font size",
      });

      return; // Stop further execution
    }

    // Validate watermark text for each file
    files.forEach((fileObj, index) => {
      if (!watermarkText[index] || watermarkText[index].length < 1) {
        validationErrors[`watermarkText_${index}`] =
          "Watermark text must be at least 1 character.";
        Swal.fire({
          icon: "error",
          title: "Watermark text must be at minimum 1 character.",
          //text: "Please select file.",
        });
      }
    });

    // If validation errors exist, update state and return early
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true); // Set loading state

    const formData = new FormData();

    // Append files and watermark text to FormData
    files.forEach((fileObj, index) => {
      formData.append("files[]", fileObj); // Append file
      formData.append("watermark_text[]", watermarkText[index]); // Append watermark text
      formData.append("watermark_position[]", watermarkTextPosition); // Add selected position
      formData.append("watermarkFontSize", watermarkFontSize[0]); // Add selected font size
      formData.append("watermarkOpacity", watermarkOpacity[0]); // Add selected opacity
    });

    try {
      // Send data to backend for processing
      const response = await axios.post("/public/watermark-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success response
      if (response.data.download_link) {
        console.log("Log: " + response.data.download_link);
        setDownloadLink(response.data.download_link);
        // Uncomment to redirect automatically:
        // window.location.href = response.data.download_link;
      }
    } catch (error) {
      console.error("Error uploading files:", error);

      // Handle backend error response with custom message
      if (
        error.response &&
        error.response.data &&
        error.response.data.customMsg
      ) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        // Display backend custom error message
        Toast.fire({
          icon: "error",
          title: error.response.data.customMsg,
        });
      } else {
        // Fallback for general errors
        Swal.fire({
          icon: "error",
          text: "It seems that your PDF file is not compatible with our system due to certain compression techniques. Please check if the file is in a supported format or try uploading a different one.",
          // text: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "1000px" }}>
      <div className=" p-4">
      
          <div className="tools-top__headlines">
            <h2 className="title">Watermark PDF</h2>
          </div>

          <div
            className="upload-area text-center mt-3"
            onClick={() => document.getElementById("upload").click()}>
            <p className="upload-instruction">
              {" "}
              Upload your PDF file and add a watermark with custom settings.
            </p>
            {/* Upload Section */}
            <div className="upload-section text-center">
              <label htmlFor="upload" className="btn btn-primary px-4 py-2">
                Select PDF File
              </label>
              <input
                type="file"
                id="upload"
                accept="application/pdf"
                onChange={handleFileChange}
                className="d-none"
              />
              {errorMessage && (
                <p className="text-danger mt-2">{errorMessage}</p>
              )}
            </div>
          </div>

          {/* Watermark Settings */}
          {files.length > 0 && (
            <div className="settings mt-4">
              {files.map((file, index) => (
                <div key={index} className="file-card p-3 mb-3">
                  <h5 className="text-primary">{file.name}</h5>

                  <div className="row">
                    <div className="col-md-4">
                      <label>Watermark Position</label>
                      <select
                        className="form-control"
                        value={watermarkTextPosition[index] || ""}
                        onChange={(e) =>
                          handleWatermarkPositionChange(index, e.target.value)
                        }
                      >
                        <option value="">Select Position</option>
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="center">Center</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label>Font Size</label>
                      <select
                        className="form-control"
                        value={watermarkFontSize[index] || ""} // Default to 30
                        onChange={(e) =>
                          handleWatermarkFontSizeChange(
                            index,
                            Number(e.target.value)
                          )
                        }
                      >
                        <option value="">Select Font</option>
                        {Array.from({ length: 50 }, (_, i) => i + 10).map(
                          (size) => (
                            <option key={size} value={size}>
                              {size}px
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label>Opacity</label>
                      <select
                        className="form-control"
                        value={watermarkOpacity[index] || ""} // Default opacity to 1 (fully opaque)
                        onChange={(e) =>
                          handleWatermarkOpacityChange(
                            index,
                            parseFloat(e.target.value)
                          )
                        }
                      >
                        <option value="">Select Opacity</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i} value={(i + 1) / 10}>
                            {(i + 1) / 10}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Enter watermark text"
                    value={watermarkText[index] || ""}
                    onChange={(e) =>
                      handleWatermarkTextChange(index, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* Generate PDF Button */}
          {files.length > 0 && (
            <button
              className="btn btn-success w-100 mt-3"
              onClick={handleGeneratePdf}
            >
              {isLoading ? "Processing..." : "Generate PDF"}
            </button>
          )}

          {/* PDF Preview */}
          {downloadLink && (
            <div className="pdf-preview mt-4">
              <iframe
                src={downloadLink}
                width="100%"
                height="500px"
                className="border rounded"
              />
            </div>
          )}

          {/* Download Section */}
          {downloadLink && (
            <div className="text-center mt-4">
              <a
                href={downloadLink}
                target="_blank"
                className="btn btn-primary"
              >
                Download PDF
              </a>
            </div>
          )}

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
        
      </div>
      <br />
      <br />
    </div>
  );
};

export default PDFUploadWithWatermark;
