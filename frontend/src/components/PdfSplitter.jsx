import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import axios from '/config/axiosConfig';
import loaderImage from '../assets/loadergif.gif'; // Ensure you have a loader gif available
import { Route } from 'react-router-dom';
import { Link } from "react-router-dom";
const PdfSplitter = ({ description }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    fetchData();  // Only validate the limit on page load
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
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `page_${i + 1}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }

      setIsLoading(false);

      // Trigger the insertion of data only after successful PDF split
      await axios.post('/public/insertSplitData', {
        action: 'PDF Split',
        timestamp: new Date().toISOString(),
        fileName: '',//file.name,
      });

    } catch (error) {
      console.error("Error splitting PDF:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
  {/* Bootstrap Card */}
  <div className="card rounded-4 border-0">
    <div className="card-body p-4">
      {/* Title Section */}
      <div className="text-center mb-4">
        <h2 className="card-title fw-bold">Split PDF File</h2>
        <p className="card-subtitle text-muted">
          Upload a PDF file and split it into individual pages.
        </p>
      </div>

      {/* Loading Section */}
      {isLoading && (
        <div className="text-center mb-4">
          <img src={loaderImage} alt="Loading..." className="mb-2" style={{ maxWidth: '150px' }} />
          <p className="text-primary fw-medium">Please wait {countdown} seconds.</p>
        </div>
      )}

      {/* File Upload Section */}
      <div className="mb-4 text-center">
        <label htmlFor="upload" className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold">
          Select PDF File
        </label>
        <input
          type="file"
          id="upload"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={isLoading || limitReached}
          className="d-none"
        />
      </div>

      {/* Description Section */}
      <div className="mt-4">
        <h5 className="text-center fw-semibold mb-3">
          <div
            dangerouslySetInnerHTML={{
              __html: description.meta_title || "Default Meta Title",
            }}
          />
        </h5>
        <div
          className="text-muted"
          dangerouslySetInnerHTML={{
            __html: description.description_full || "Default Full Description",
          }}
        />
      </div>
    </div>
  </div>

  {/* Bootstrap Modal */}
  <div
    className={`modal fade ${showModal ? 'show d-block' : ''}`}
    tabIndex="-1"
    role="dialog"
    style={{ backgroundColor: showModal ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content rounded-4 shadow">
        <div className="modal-header border-0">
          <h5 className="modal-title fw-bold text-danger">Error</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          />
        </div>
        <div className="modal-body">
          {limitReached ? (
            <p className="text-muted">
              You've reached your daily limit for this action. To view pricing details, please{' '}
              <Link to="/pricing" className="text-decoration-none fw-semibold">
                check here
              </Link>.
            </p>
          ) : (
            <p className="text-muted">Please upload a PDF file to proceed.</p>
          )}
        </div>
        <div className="modal-footer border-0">
          <button
            type="button"
            className="btn btn-secondary rounded-pill px-4"
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