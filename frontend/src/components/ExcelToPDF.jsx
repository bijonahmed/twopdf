import React, { useState } from "react";
import * as XLSX from "xlsx"; // Import SheetJS
import html2pdf from "html2pdf.js"; // Import html2pdf.js for PDF conversion
import axios from "/config/axiosConfig";
import loaderImage from "../assets/loadergif.gif";
import "../components/css/exceltopdf.css";

const ExcelToPDF = ({ description }) => {
  const [excelFile, setExcelFile] = useState(null); // Store selected Excel file
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [htmlContent, setHtmlContent] = useState(""); // Store HTML table content
  const [error, setError] = useState(""); // Store error messages
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [fileName, setFileName] = useState("");
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
  // Function to handle export to HTML
  const handleExportToHTML = () => {
    // Ensure we have content to export
    if (htmlContent) {
      // Create a Blob from the HTML content
      const blob = new Blob([htmlContent], { type: "text/html" });

      // Create an anchor element for downloading the Blob
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "excel-content.html"; // Set the default filename

      // Trigger the download by clicking the anchor
      link.click();
    }
  };

  // Handle Excel file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check if file is a valid Excel file
    if (
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      file.type !== "application/vnd.ms-excel"
    ) {
      setError("Please upload a valid Excel file (.xlsx or .xls)");
      setExcelFile(null);
      setHtmlContent("");
      setFileName("");
      return;
    }

    setError(""); // Clear any previous errors
    setExcelFile(file); // Store the selected file
    setHtmlContent(""); // Clear previous content
    setFileName(file.name);
  };

  // Upload Excel file to the server
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/public/upload-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Return the URL or response data after the file upload
      return response.data.fileUrl;
    } catch (error) {
      console.error("File upload error:", error);
      setError("There was an error uploading the Excel file.");
      setIsLoading(false);
      throw error;
    }
  };

  // Convert Excel to HTML table and then to PDF
  const handleConvertToPDF = async () => {
    if (!excelFile) {
      alert("Please select an Excel file first.");
      return;
    }

    setIsLoading(true); // Start loading
    setError(""); // Reset any previous errors

    try {
      // Upload the file to the server first
      const fileUrl = await uploadFile(excelFile);
      console.log("File uploaded successfully: ", fileUrl);

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" }); // Read Excel file

          const sheetNames = workbook.SheetNames;
          if (sheetNames.length === 0) {
            setError("No sheets found in the Excel file.");
            setIsLoading(false);
            return;
          }

          const sheet = workbook.Sheets[sheetNames[0]]; // Get the first sheet
          if (!sheet) {
            setError("Sheet data is undefined.");
            setIsLoading(false);
            return;
          }

          const range = sheet["!ref"];
          if (!range) {
            setError("Sheet is empty or invalid.");
            setIsLoading(false);
            return;
          }

          // Convert the sheet data into an HTML table
          const htmlTable = XLSX.utils.sheet_to_html(sheet);

          // Ensure HTML content was generated correctly
          if (!htmlTable || htmlTable.trim() === "") {
            setError("Failed to generate HTML content from the Excel file.");
            setIsLoading(false);
            return;
          }

          setHtmlContent(htmlTable); // Store HTML table content
          setIsLoading(false); // End loading

          // Convert the HTML content to PDF
          const container = document.createElement("div");
          container.innerHTML = htmlTable;

          const options = {
            margin: 10,
            filename: "converted-file.pdf",
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          };

          // Ensure that the full content (all rows and columns) is rendered into the PDF
          html2pdf().from(container).set(options).save(); // Convert to PDF and download
        } catch (error) {
          console.error("Error during file processing:", error);
          setError("There was an error processing the Excel file.");
          setIsLoading(false);
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading the file:", error);
        setError("There was an error reading the file.");
        setIsLoading(false);
      };

      reader.readAsArrayBuffer(excelFile); // Read the file as ArrayBuffer
    } catch (error) {
      setIsLoading(false); // Stop loading if upload fails
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="border-light rounded-lg">
            <div className="text-center  text-black">
            <div className="tools-top__headlines">
          <h2 className="title">Convert Excel to PDF</h2>
          <center> {fileName && <p className="text-success mt-2">Selected File: {fileName}</p>}</center>
        </div>
             
            </div>

            <div className="upload-area text-center mt-3" onClick={() => document.getElementById("pdfUpload").click()}>

              
                {isLoading && (
                  <center>
                    <div className="loading">
                      <img src={loaderImage} alt="Loading..." />
                      <center>
                        <p className="text-muted">Loading... Please wait</p>
                      </center>
                    </div>
                  </center>
                )}

                {/* Error message display */}
                {error && <div className="alert alert-danger">{error}</div>}

                <label htmlFor="upload" className="btn btn-primary">
                  Select Excel File
                </label>
                <input
                  type="file"
                  id="pdfUpload"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />


              

              {htmlContent && (
                <div
                  style={{
                    padding: "20px",
                    border: "1px solid #ddd",
                    maxHeight: "300px",
                    overflowY: "auto",
                    marginTop: "20px",
                    borderRadius: "8px",
                    backgroundColor: "#f4f7fa",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }} // Render the HTML table content
                />
              )}
            </div>

            {/* Button to trigger conversion to PDF */}
            <button
                  onClick={handleConvertToPDF}
                  disabled={isLoading || !excelFile} // Disable if no file selected or loading
                  className="btn btn-primary w-100 mt-3 py-2"
                  style={{ fontSize: "16px" }}
                >
                  {isLoading ? "Converting..." : "Convert to PDF"}
                </button>

                {/* Button to trigger export to HTML */}
                <button
                  onClick={handleExportToHTML}
                  disabled={isLoading || !htmlContent} // Disable if no content to export or loading
                  className="btn btn-secondary w-100 mt-3 py-2"
                  style={{ fontSize: "16px" }}
                >
                  Export to HTML
                </button>
          </div>
          <br />
          <h3 className="text-center text-dark">
            <div
              className="font-weight-bold"
              dangerouslySetInnerHTML={{
                __html: description.meta_title || "Default Meta Title",
              }}
            />
          </h3>
          <div
            className="text-justify mt-3"
            style={{ textAlign: "justify" }}
            dangerouslySetInnerHTML={{
              __html:
                description.description_full || "Default Full Description",
            }}
          />
          <br />
        </div>
      </div>
    </div>
  );
};

export default ExcelToPDF;
