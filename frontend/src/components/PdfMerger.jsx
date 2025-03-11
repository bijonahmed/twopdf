import React, { useState } from "react";
import axios from "/config/axiosConfig";
import loaderImage from "../assets/loadergif.gif";
import "../components/css/mergePDF.css";
import { PDFDocument } from "pdf-lib";

const SortableItem = ({ file, index, onDragStart, onDrop, onDragOver }) => {
  return (
    <div
      className="col-12 col-md-3 mb-3" // This ensures 4 items per row on medium screens and up
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragOver={onDragOver}
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
        cursor: "move",
      }}
    >
      <div className="sortable-header">
        <i className="sortable-icon fas fa-grip-vertical"></i>
      </div>

      <iframe
        src={file.previewUrl}
        width="100%"
        height="300px"
        title={file.file.name}
        className="pdf-preview"
      ></iframe>
      <p className="text-center mt-2">{file.file.name}</p>
    </div>
  );
};

const PdfMerger = ({ description }) => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 
  const [limitReached, setLimitReached] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const handleMerge = async () => {
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        if (file.file.type !== "application/pdf") {
          alert(`The file ${file.file.name} is not a valid PDF.`);
          return; // Skip this file if it's not a PDF
        }
        const fileReader = new FileReader();
        const promise = new Promise((resolve, reject) => {
          fileReader.onloadend = async () => {
            try {
              const existingPdfBytes = fileReader.result;
              const existingPdf = await PDFDocument.load(existingPdfBytes);
              const copiedPages = await mergedPdf.copyPages(
                existingPdf,
                existingPdf.getPageIndices()
              );
              copiedPages.forEach((page) => mergedPdf.addPage(page));
              resolve();
            } catch (error) {
              console.error(`Error loading PDF ${file.file.name}:`, error);
              alert(
                `Error loading PDF ${file.file.name}. Please ensure it's a valid PDF.`
              );
              reject(error); // Reject the promise on error
            }
          };

          fileReader.onerror = (error) => reject(error);
        });
        fileReader.readAsArrayBuffer(file.file);
        await promise;
      }
      // Save the merged PDF document
      const pdfBytes = await mergedPdf.save();
      // Create a blob and download it as a PDF
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "TwopdfMerged.pdf";
      link.click();
      // Optionally, you can display a success message
      //alert("PDFs merged successfully!");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("An error occurred while merging the PDFs.");
    }
  };

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

    const filesWithPreview = selectedFiles.map((file, index) => ({
      id: `${file.name}-${index}`, // Unique ID for sorting
      file,
      previewUrl: urls[index],
    }));

    setFiles(filesWithPreview);
    setIsLoading(true);
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const onDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData("index");
    const draggedFile = files[draggedIndex];

    const newFiles = [...files];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, draggedFile);

    setFiles(newFiles);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const startCountdown = () => {
    setCountdown(5);

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    setCountdownInterval(interval);

    setTimeout(() => {
      handleMerge();
    }, 5000);
  };

  return (
    <div className="container-fluid">
      <h2 className="text-center">Drag & Drop PDF Sorting</h2>

      <div className="text-center mb-3">
        <label htmlFor="upload" className="btn btn-primary">
          Select PDFs
        </label>
        <input
          type="file"
          id="upload"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="row">
        {files.map((file, index) => (
          <SortableItem
            key={file.id}
            file={file}
            index={index}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDragOver={onDragOver}
          />
        ))}
      </div>

      {files.length > 1 && (
        <div className="text-center mt-4">
          <center>
            <button className="btn btn-success" onClick={startCountdown}>
              Merge PDFs
            </button>
            <br />
            <br />
          </center>
        </div>
      )}

      <center>
        {countdown > 0 && !limitReached && (
          <div className="loading">
            <img src={loaderImage} alt="Loading..." />
            <center>
              <p>Please wait {countdown} seconds.</p>
            </center>
          </div>
        )}
      </center>

      <div className="container">
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
            __html: description.description_full || "Default Full Description",
          }}
        />
      </div>

      <br />

      <div>
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
      </div>
    </div>
  );
};

export default PdfMerger;
