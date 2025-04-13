import React, { useState } from "react";
import JSZip from "jszip";
import html2pdf from "html2pdf.js";
import "../components/css/ppt_to_pdf_wrapper.css";
import PDFTools from "../components/PDFTools.jsx";

const PptxToHtmlPreview = ({ description }) => {
  const [pptxFile, setPptxFile] = useState(null);
  const [pptxFileName, setPptxFileName] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      setPptxFile(file);
      setPptxFileName(file.name); // Store file name
    } else {
      alert("Please upload a valid PPTX file.");
    }
  };

  // Handle PPTX to HTML conversion
  const handleConvert = () => {
    if (!pptxFile) {
      alert("Please upload a PPTX file first.");
      return;
    }

    setLoading(true);
    setSlides([]);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;

      try {
        const zip = await JSZip.loadAsync(arrayBuffer);
        const slideXmlFiles = Object.keys(zip.files).filter(
          (fileName) =>
            fileName.startsWith("ppt/slides/slide") && fileName.endsWith(".xml")
        );

        const slidesData = [];
        const promises = slideXmlFiles.map(async (slideXmlFile, index) => {
          const xmlContent = await zip.files[slideXmlFile].async("string");
          const slideContent = await extractTextAndImagesFromXml(
            xmlContent,
            zip
          );
          slidesData.push({
            slideNumber: index + 1,
            text: slideContent.text,
            images: slideContent.images,
          });
        });

        await Promise.all(promises);
        setSlides(slidesData);
      } catch (error) {
        console.error("Error processing PPTX file:", error);
        alert("An error occurred while processing the PPTX file.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(pptxFile);
  };

  const extractTextAndImagesFromXml = async (xmlContent, zip) => {
    return new Promise((resolve) => {
      let slideText = "";
      let slideImages = [];

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
      const slideElements = xmlDoc.getElementsByTagName("p:sp");

      for (let i = 0; i < slideElements.length; i++) {
        const txBody = slideElements[i].getElementsByTagName("p:txBody")[0];
        if (txBody) {
          const paragraphs = txBody.getElementsByTagName("a:p");
          for (let j = 0; j < paragraphs.length; j++) {
            const runs = paragraphs[j].getElementsByTagName("a:r");
            for (let k = 0; k < runs.length; k++) {
              const text = runs[k].getElementsByTagName("a:t")[0];
              if (text) {
                slideText += text.textContent + " ";
              }
            }
          }
        }
      }

      resolve({ text: slideText.trim(), images: slideImages });
    });
  };

  const handleExportPDF = () => {
    const element = document.getElementById("slides-preview");
    const options = {
      margin: 1,
      filename: "pptx-preview.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: "avoid-all", after: ".slide-card" },
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="container">
      <div className="tools-top__headlines">
        <h2 className="title">Convert PPT to PDF</h2>
      </div>

      {/* File upload section */}
      <div className="upload-area text-center mt-3">
        <p className="upload-instruction">Upload PPTX File</p>

        <div className="card mb-4 p-3">
          {pptxFileName && (
            <p className="uploaded-file-name">
              <b>File:</b> {pptxFileName}
            </p>
          )}

          <label htmlFor="pdfUpload" className="btn btn-primary">
            Select PPTX
          </label>
          <input
            type="file"
            id="pdfUpload"
            accept=".pptx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Buttons for Conversion and PDF Export */}
      <div className="text-center">
        <button
          className="btn btn-primary w-100 mb-2"
          onClick={handleConvert}
          disabled={!pptxFile || loading}
        >
          {loading ? "Loading..." : "Convert to HTML and Preview"}
        </button>

        <button
          className="btn btn-success w-100"
          onClick={handleExportPDF}
          disabled={slides.length === 0}
        >
          Export to PDF
        </button>
      </div>

      {loading && (
        <div className="loading-spinner text-center mb-4">Loading...</div>
      )}

      {/* Slide Preview */}
      <div id="slides-preview" className="row">
        {slides.map((slide, index) => (
          <div className="col-md-12" key={index}>
            <div
              className="card shadow-sm slide-card"
              style={{ borderRadius: "10px", marginBottom: "20px" }}
            >
              <div className="card-body">
                <div
                  className="card-text"
                  dangerouslySetInnerHTML={{
                    __html: slide.text || "No text found in this slide.",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="container mt-lg-4">
        <PDFTools />
      </div>
      <br/>
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
        className="text-justify mt-3 p-2"
        style={{ textAlign: "justify" }}
        dangerouslySetInnerHTML={{
          __html: description.description_full || "Default Full Description",
        }}
      />

     
    </div>
  );
};

export default PptxToHtmlPreview;
