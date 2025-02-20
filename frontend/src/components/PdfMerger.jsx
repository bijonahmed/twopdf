import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import loaderImage from "../assets/loadergif.gif";
import axios from "/config/axiosConfig";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";

const PdfMerger = ({ description }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    //fetchData();
  }, []);
 
  const fetchData = async () => {
    try {
      const response = await axios.get(`/public/countPerDayValidation`);
      console.log("Response Status:", response.data.responseStatus);
      if (response.data.responseStatus === 0) {
        setLimitReached(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const validateLimit = async () => {
    try {
      const response = await axios.get(`/public/countPerDayValidation`);
      console.log("Response Status:", response.data.responseStatus);
      if (response.data.responseStatus === 0) {
        setLimitReached(true);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error fetching data:", error);
      return false;
    }
  };

  const handleFileChange = async (event) => {
    const isValid = await validateLimit();
    if (!isValid) {
      setLimitReached(true);
      return;
    }

    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length < 2) {
      setShowModal(true);
      return;
    }

    // Generate preview URLs
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    setFiles(selectedFiles);
    setIsLoading(true);
    setCountdown(5);

    // Start the countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    // Start merging process after 5 seconds
    setTimeout(() => {
      mergePdfs(selectedFiles);
    }, 5000);
  };

  const mergePdfs = async (selectedFiles) => {
    const mergedPdf = await PDFDocument.create();

    for (const file of selectedFiles) {
      const fileArrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileArrayBuffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

      pages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();
    URL.revokeObjectURL(url);
    setIsLoading(false);
  };

  return (
    <div>
      <div className="tools container-1060" style={{ minHeight: "100vh" }}>
        <div className="tools-top">
          <div className="tools-top__headlines">
            <h2 className="title">Merge PDF files</h2>
            <p className="subtitle">
              Combine PDFs in the order you want with the easiest PDF merger
              available.
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
              <label htmlFor="upload">Select PDF files</label>
              <input
                type="file"
                id="upload"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
              />
            </div>
            <br/>
            <div className="row">
        {previewUrls.map((url, index) => (
          <div className="col-4 mb-3" key={index}>
            <iframe
              src={url}
              width="100%"
              height="400px"
              title={`PDF Preview ${index + 1}`}
              className="border"
            ></iframe>
          </div>
        ))}
      </div>
            <br />


            <h1>
         <center><div
            className="text-justify"
            dangerouslySetInnerHTML={{
              __html: description.meta_title || "Default Meta Title",
            }}
          /></center> 
        </h1>
        <div
          className="text-justify mt-3"
          dangerouslySetInnerHTML={{
            __html: description.description_full || "Default Full Description",
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
              <h5 className="modal-title">File Upload Error</h5>
            </div>
            <div className="modal-body">
              <p>Please upload at least two PDF files.</p>
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

      <div
        className={`modal ${limitReached ? "d-block" : "d-none"}`}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Daily Limit Reached</h5>
            </div>
            <div className="modal-body">
              <p>
                You've reached your daily limit for this action. To view pricing
                details, Please <Link to="/pricing">check here</Link>.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setLimitReached(false)}
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

export default PdfMerger;
