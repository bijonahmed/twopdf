import React, { useState, useEffect } from "react";
import * as pdfjs from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry"; // Import worker inline
import "../components/css/exceltopdf.css";

const PDFToJPG = ({ description }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [renderedPages, setRenderedPages] = useState([]);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = null; // Disable workers
  }, []);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = async () => {
        const pdfData = new Uint8Array(fileReader.result);
        const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
        setNumPages(pdf.numPages);
        setPdfDoc(pdf);
        renderPDFPages(pdf); // Render PDF pages
      };
    }
  };

  // Render PDF pages for preview
  const renderPDFPages = async (pdf) => {
    let pagesArray = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const canvas = await renderPage(pdf, i);
      if (canvas) {
        pagesArray.push(canvas.toDataURL("image/png"));
      }
    }
    setRenderedPages(pagesArray);
  };

  // Render a single PDF page on canvas
  const renderPage = async (pdf, pageNum) => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale for preview
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = { canvasContext: ctx, viewport };
    await page.render(renderContext).promise;

    return canvas;
  };

  // Convert PDF pages to JPG
  const handleConvertToJPG = async () => {
    if (!pdfDoc) return;

    for (let i = 1; i <= numPages; i++) {
      const canvas = await renderPage(pdfDoc, i);
      if (canvas) {
        const image = canvas.toDataURL("image/jpeg");

        // Create download link
        const link = document.createElement("a");
        link.href = image;
        link.download = `page-${i}.jpg`;
        link.click();
      }
    }
  };

  // Inline CSS styles
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "auto",
      padding: "20px",
    },
    card: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",

      marginBottom: "20px",
      textAlign: "center",
    },
    title: {
      color: "#007bff",
      fontSize: "24px",
      fontWeight: "bold",
      margin: 0,
    },
    heading: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "10px",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    previewContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    imageCard: {
      width: "300px",
      margin: "10px",
      padding: "10px",
      borderRadius: "10px",

      backgroundColor: "#f9f9f9",
      textAlign: "center",
    },
    image: {
      width: "100%",
      borderRadius: "5px",
      border: "1px solid #ddd",
    },
    imageText: {
      fontSize: "14px",
      color: "#555",
      marginTop: "5px",
    },
    button: {
      backgroundColor: "#28a745",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      fontSize: "16px",
      cursor: "pointer",
      marginTop: "15px",
    },
    description: {
      color: "#555",
      fontSize: "14px",
      textAlign: "justify",
    },
  };

  return (
    <div className="container">
      {/* Title Card */}
      <br />

      <div className="tools-top__headlines">
        <h2 className="title">
          <div
            dangerouslySetInnerHTML={{
              __html: description.meta_title || "Default Meta Title",
            }}
          />
        </h2>
      </div>

      <div
        className="upload-area text-center mt-3"
        onClick={() => document.getElementById("pdfUpload").click()}
      >
        <p className="upload-instruction">
          Convert your PDF to a JPG file in seconds.
        </p>

       
        <label htmlFor="upload" className="btn btn-primary">
          Select PDFs
        </label>
        <input
          type="file"
          id="pdfUpload"
          accept="application/pdf"
          multiple
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />





        {/* PDF Preview */}
        
      </div>

      {pdfDoc && (
          <div>
            <h5 style={styles.heading}>PDF Preview:</h5>
            <div style={styles.previewContainer}>
              {renderedPages.map((imgSrc, index) => (
                <div key={index} style={styles.imageCard}>
                  <img
                    src={imgSrc}
                    alt={`Page ${index + 1}`}
                    style={styles.image}
                  />
                  <div style={styles.imageText}>Page {index + 1}</div>
                </div>
              ))}
            </div>

            <center><button onClick={handleConvertToJPG} style={styles.button}>
              Convert to JPG
            </button></center>
          </div>
        )}

      {/* Description Card */}
      <div >
        <div
          className="text-justify"
          style={{ textAlign: "justify" }}
          dangerouslySetInnerHTML={{
            __html: description.description_full || "Default Full Description",
          }}
        />
      </div>
      <br/>
    </div>
  );
};

export default PDFToJPG;
