import React, { useState, useEffect, useRef } from "react";
import * as pdfjs from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry";
import "../components/css/roatePDF.css";
import "../components/css/rotatePDFwrapper.css";
const RotatePDF = ({ description }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = null;
  }, []);

  const exportToJPG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = image;
    link.download = `page-${currentPage}.jpg`;
    link.click();
  };

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
        renderPage(pdf, 1);
      };
    }
  };

  const renderPage = async (pdf, pageNum) => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: zoom, rotation });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    ctx.save();
    ctx.translate(flipX ? canvas.width : 0, flipY ? canvas.height : 0);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

    const renderContext = { canvasContext: ctx, viewport };
    await page.render(renderContext).promise;

    ctx.restore();
  };

  useEffect(() => {
    if (pdfDoc) renderPage(pdfDoc, currentPage);
  }, [rotation, zoom, flipX, flipY, currentPage]);

  return (
    <div className="container mt-4">
      <div className=" p-4 rounded">
        <div className="tools-top__headlines">
          <h2 className="title">PDF Rotate</h2>
        </div>

        <div
          className="upload-area text-center mt-3"
          onClick={() => document.getElementById("upload").click()} >
          <p className="upload-instruction"> Please upload your pdf</p>

      <label htmlFor="upload" className="btn btn-primary">
          Select PDFs
        </label>
        <input
          type="file"
          id="upload"
          accept="application/pdf"
          multiple
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        </div>

        <div className="d-flex justify-content-center">
          <canvas
            ref={canvasRef}
            className={`border rounded ${
              pdfDoc ? "visible-canvas" : "hidden-canvas"
            }`}
            style={{ backgroundColor: "#f8f9fa" }}
          ></canvas>
        </div>

        {pdfDoc && (
          <>
            <div className="text-center my-3">
              <span className="fw-bold">
                Page {currentPage} / {numPages}
              </span>
            </div>
          </>
        )}
        <h1 className="text-center text-primary fw-bold mb-3">
          {description?.meta_title || "Default Meta Title"}
        </h1>
        <div
          className="text-justify mt-3"
          style={{ textAlign: "justify" }}
          dangerouslySetInnerHTML={{
            __html: description.description_full || "Default Full Description",
          }}
        />
      </div>

      {/* Fixed Bottom Toolbar */}
      {pdfDoc && (
        <div className="toolbar">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
            ⬅️
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
          >
            ➡️
          </button>
          <button onClick={() => setRotation((r) => (r - 90) % 360)}>🔄</button>
          <button onClick={() => setRotation((r) => (r + 90) % 360)}>🔃</button>
          <button onClick={() => setFlipX((f) => !f)}>↔️</button>
          <button onClick={() => setFlipY((f) => !f)}>↕️</button>
          <button onClick={() => setZoom((z) => z + 0.2)}>➕</button>
          <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}>
            ➖
          </button>
          <button onClick={exportToJPG}>🖼</button>
        </div>
      )}
      <br />
    </div>
  );
};

export default RotatePDF;
