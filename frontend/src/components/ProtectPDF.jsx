import React, { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import loaderImage from "../assets/loadergif.gif";
import axios from "/config/axiosConfig";
import { Link } from "react-router-dom";

const ProtectPDF = ({ description }) => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({}); // Store validation errors
  const [pdfUrl, setPdfUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Fetch daily limit validation data
  const fetchData = async () => {
    try {
      const response = await axios.get(`/public/countPerDayValidationSplit`);
      if (response.data.responseStatus === 0) {
        setLimitReached(true);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [selectedColor, setSelectedColor] = useState("#000000");
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isCopied, setIsCopied] = useState(false);
  const handleShare = () => {
    // Create a temporary input element to hold the URL for copying
    const textField = document.createElement("input");
    textField.value = pdfUrl;
    document.body.appendChild(textField);

    // Select and copy the text inside the input field
    textField.select();
    document.execCommand("copy");

    // Remove the temporary input field
    document.body.removeChild(textField);

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset "Copied!" message after 2 seconds
  };
  const handleCopy = () => {
    // Create a temporary input element to hold the URL for copying
    const textField = document.createElement("input");
    textField.value = pdfUrl;
    document.body.appendChild(textField);

    // Select and copy the text inside the input field
    textField.select();
    document.execCommand("copy");

    // Remove the temporary input field
    document.body.removeChild(textField);

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset "Copied!" message after 2 seconds
  };

  const handleGeneratePdf = async () => {
    // Reset previous errors
    setErrors({});

    let validationErrors = {};

    if (!content || content.length < 5) {
      validationErrors.content = "Content must be at least 5 characters.";
    }

    if (!password || password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set errors if validation fails
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("content", content);
    formData.append("password", password);

    try {
      const response = await axios.post("/public/protect-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.download_link) {
        setPdfUrl(response.data.download_link);
        setIsModalOpen(true);
        console.log("Download link:", response.data.download_link);
        // window.open(response.data.download_link, "_blank");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error with the request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tools container-1060" style={{ minHeight: "100vh" }}>
      <div className="tools-top">
        <div className="tools-top__headlines">
          <h2 className="title">Generate Password-Protected PDF</h2>
        </div>

        <div className="container mt-4">
          <div className="col-md-12">
            <div className="card p-4 shadow">
              {/* Text Area */}
              <div className="mb-3">
                <label className="form-label fw-bold">Write Content</label>
                <textarea
                  id="contentTextarea"
                  className={`form-control ${
                    errors.content ? "is-invalid" : ""
                  }`}
                  rows="15"
                  placeholder="Enter content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ color: selectedColor }}
                ></textarea>
                {errors.content && (
                  <div className="text-danger">{errors.content}</div>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <label className="form-label fw-bold">Enter Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <div className="text-danger">{errors.password}</div>
                )}
              </div>

              {/* Generate PDF Button */}
              <button
                className="btn btn-primary w-100"
                onClick={handleGeneratePdf}
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate PDF"}
              </button>
            </div>
          </div>
        </div>
        {isLoading && <p>Loading...</p>}

        {isLoading && (
          <center>
            <div className="loading">
              <img src={loaderImage} alt="Loading..." />
              <p>Processing your PDF...</p>
            </div>
          </center>
        )}

        <h1
          className="text-justify mt-2"
          dangerouslySetInnerHTML={{
            __html: description.meta_title || "Default Meta Title",
          }}
        />
        <div
          className="text-justify mt-3"
          dangerouslySetInnerHTML={{
            __html: description.description_full || "Default Full Description",
          }}
        />
      </div>

      {/* PDF Modal */}
      {isModalOpen && (
        <div
          className="modal show"
          style={{
            display: "block",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1040,
          }}
        >
          <div
            className="modal-dialog modal-fullscreen"
            style={{
              margin: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              resize: "both", // Allows resizing
              overflow: "auto", // Ensures the content doesn't overflow when resizing
              maxWidth: "90%", // Max width for resizing
              maxHeight: "90%", // Max height for resizing
            }}
          >
            <div
              className="modal-content"
              style={{
                width: "100%",
                height: "100%",
                resize: "both", // Allow resizing of the modal content
                overflow: "auto", // Ensure content inside the modal is scrollable when resized
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Generated PDF</h5>
                {/* <button type="button" className="close" onClick={closeModal}>
                &times;
              </button> */}
              </div>
              <div className="modal-body" style={{ padding: 0 }}>
                <embed
                  src={pdfUrl}
                  width="100%"
                  height="100%"
                  type="application/pdf"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
                <button className="btn btn-info" onClick={handleCopy}>
                  <i className="fa fa-copy"></i>{" "}
                  {isCopied ? "Copied!" : "Copy Link"}
                </button>

                {/* Updated 'Share with Friends' button with distinct functionality */}
                <button className="btn btn-info" onClick={handleShare}>
                  <i className="fa fa-share-alt"></i>{" "}
                  {isCopied ? "Shared!" : "Share with Friends"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Error</h5>
              </div>
              <div className="modal-body">
                {limitReached ? (
                  <p>
                    You've reached your daily limit. To view pricing,{" "}
                    <Link to="/pricing">check here</Link>.
                  </p>
                ) : (
                  <p>Please upload a PDF file to proceed.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtectPDF;
