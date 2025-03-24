import React, { useState } from "react";
import JSZip from "jszip";
import html2pdf from "html2pdf.js"; // Import html2pdf library
import "../components/css/ppt_to_pdf_wrapper.css";

const PptxToHtmlPreview = ({ description }) => {
  const [pptxFile, setPptxFile] = useState(null);
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
    setSlides([]); // Clear previous slides

    // Read the PPTX file
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

        // Wait for all slide processing to complete
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

  // Extract text and images from the slide XML
  const extractTextAndImagesFromXml = async (xmlContent, zip) => {
    return new Promise((resolve, reject) => {
      let slideText = "";
      let slideImages = [];

      // Use DOMParser to parse XML content
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
      const slideElements = xmlDoc.getElementsByTagName("p:sp");

      // Extract text from the slide XML
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

      // Extract images from the slide XML
      for (let i = 0; i < slideElements.length; i++) {
        const pictureElement =
          slideElements[i].getElementsByTagName("p:pic")[0];
        if (pictureElement) {
          const imagePath = pictureElement
            .getElementsByTagName("p:blipFill")[0]
            .getElementsByTagName("a:blip")[0]
            .getAttribute("src");
          if (imagePath) {
            const imageFileName = imagePath.split("/").pop();
            if (zip.files[`ppt/media/${imageFileName}`]) {
              zip.files[`ppt/media/${imageFileName}`]
                .async("base64")
                .then(function (imgData) {
                  slideImages.push(`data:image/jpeg;base64,${imgData}`);
                  resolve({ text: slideText.trim(), images: slideImages });
                });
            }
          }
        }
      }

      resolve({ text: slideText.trim(), images: slideImages });
    });
  };

  // Function to export HTML to PDF
  const handleExportPDF = () => {
    const element = document.getElementById("slides-preview");
    const options = {
      margin: 1,
      filename: "pptx-preview.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: "avoid-all", after: ".slide-card" }, // Ensure each slide is a separate page
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="container">
      {/* File upload section in card */}

      <div className="tools-top__headlines">
        <h2 className="title">Convert PPT to PDF</h2>
      </div>

      <div
        className="upload-area text-center mt-3"
        onClick={() => document.getElementById("upload").click()}
      >
        <p className="upload-instruction"> Upload PPTX File</p>

        <div className="card mb-4">
          <div className="card-body text-center">
            <input
              type="file"
              id="upload"
              className="form-control mb-3 d-inline-block"
              accept=".pptx"
              onChange={handleFileChange}
            />
            <button
              className="btn btn-primary w-100"
              onClick={handleConvert}
              disabled={!pptxFile || loading}
            >
              {loading ? "Loading..." : "Convert to HTML and Preview"}
            </button>
          </div>
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="loading-spinner text-center mb-4">Loading...</div>
        )}

        {/* Export PDF button in card */}
        <div className=" mb-4">
          <div className="text-center">
            <button
              className="btn btn-success w-100"
              onClick={handleExportPDF}
              disabled={slides.length === 0}
            >
              Export to PDF
            </button>
          </div>
        </div>

        <div id="slides-preview" className="row">
          {slides.map((slide, index) => (
            <div className="col-md-12" key={index}>
              <div
                className="card shadow-sm slide-card"
                style={{ borderRadius: "10px", marginBottom: "20px" }}
              >
                <div className="card-body">
                  {/* <h5 className="card-title">Slide {slide.slideNumber}</h5> */}
                  <div
                    className="card-text"
                    dangerouslySetInnerHTML={{
                      __html: slide.text || "No text found in this slide.",
                    }}
                  />
                  {slide.images.length > 0
                    ? slide.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Slide ${slide.slideNumber} Image ${idx + 1}`}
                          className="img-fluid mb-3"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "300px",
                            objectFit: "contain",
                          }}
                        />
                      ))
                    : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
        className="text-justify mt-3 p-2" style={{ textAlign: 'justify' }}
        dangerouslySetInnerHTML={{
          __html: description.description_full || "Default Full Description",
        }}
      />

      <br />
    </div>
  );
};

export default PptxToHtmlPreview;
