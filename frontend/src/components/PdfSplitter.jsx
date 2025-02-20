import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import axios from "/config/axiosConfig";
import loaderImage from "../assets/loadergif.gif"; // Ensure you have a loader gif available
import { Route } from "react-router-dom";
import { Link } from "react-router-dom";
const PdfSplitter = ({ description }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    fetchData(); // Only validate the limit on page load
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/public/countPerDayValidationSplit`);
      console.log("Response Status:", response.data.responseStatus);
      if (response.data.responseStatus === 0) {
        setLimitReached(true);
        setShowModal(true); // Show modal when limit is reached
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const validateLimit = async () => {
    try {
      const response = await axios.get(`/public/countPerDayValidationSplit`);
      console.log("Response Status:", response.data.responseStatus);
      if (response.data.responseStatus === 0) {
        setLimitReached(true);
        setShowModal(true); // Show modal when limit is reached
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error fetching data:", error);
      return false;
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      setShowModal(true);
      return;
    }

    const limitValid = await validateLimit();
    if (!limitValid) {
      setShowModal(true);
      return;
    }

    setFile(selectedFile);
    startCountdownAndSplit(selectedFile);
  };

  const startCountdownAndSplit = (selectedFile) => {
    setIsLoading(true);
    setCountdown(5);

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(countdownInterval);
          splitPdf(selectedFile);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const splitPdf = async (selectedFile) => {
    try {
      const fileArrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(fileArrayBuffer);
      const numPages = pdf.getPageCount();

      for (let i = 0; i < numPages; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(page);

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `page_${i + 1}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }

      setIsLoading(false);

      // Trigger the insertion of data only after successful PDF split
      await axios.post("/public/insertSplitData", {
        action: "PDF Split",
        timestamp: new Date().toISOString(),
        fileName: "", //file.name,
      });
    } catch (error) {
      console.error("Error splitting PDF:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="tools container-1060" style={{ minHeight: "100vh" }}>
        <div className="tools-top">
          <div className="tools-top__headlines">
            <h2 className="title">Split PDF File</h2>
            <p className="subtitle">
              Upload a PDF file and split it into individual pages.
            </p>
          </div>
          {isLoading && (
            <div className="loading">
              <img src={loaderImage} alt="Loading..." />
              <center>
                <p>Please wait {countdown} seconds.</p>
              </center>
            </div>
          )}
          <div className="upload_group">
            <div className="btn_group text-center">
              <label htmlFor="upload">Select PDF file</label>
              <input
                type="file"
                id="upload"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={isLoading || limitReached}
              />
            </div>

            <br />

            <h1>
              <div
                className="text-justify"
                dangerouslySetInnerHTML={{
                  __html: description.meta_title || "Default Meta Title",
                }}
              />
            </h1>
            <div
              className="text-justify mt-3"
              dangerouslySetInnerHTML={{
                __html:
                  description.description_full || "Default Full Description",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className={`modal ${showModal ? "d-block" : "d-none"}`}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Error</h5>
            </div>
            <div className="modal-body">
              {limitReached ? (
                <p>
                  You've reached your daily limit for this action. To view
                  pricing details, Please <Link to="/pricing">check here</Link>.
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
    </div>
  );
};

export default PdfSplitter;
