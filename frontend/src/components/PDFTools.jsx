import React from "react";
import { Link } from "react-router-dom";

const pdfTools = [
    { title: "Merge PDF", path: "/pdf/margepdf", img: "/images/merge_pdf.png" },
    { title: "Split PDF", path: "/pdf/splitpdf", img: "/images/spilt_pdf.webp" },
    { title: "ZIP PDF", path: "/pdf/pdfzip", img: "/images/zip_pdf.png" },
    {
        title: "PDF to Text",
        path: "/pdf/pdftotxt",
        img: "/images/pdf-to-txt.png",
    },
    { title: "PDF to PPT", path: "/pdf/pdftoppt", img: "/images/pdf_to_ppt.png" },
    {
        title: "Image to PDF",
        path: "/pdf/imgtopdf",
        img: "/images/image_to_pdf.png",
    },
    {
        title: "Protect PDF",
        path: "/pdf/protectpdf",
        img: "/images/proted_pdf.png",
    },
    {
        title: "Watermark",
        path: "/pdf/watermarkpdf",
        img: "/images/watermark_pdf.png",
    },
    {
        title: "Word to PDF",
        path: "/pdf/word-to-pdf",
        img: "/images/word-to-pdf.png",
    },
    {
        title: "PPT to PDF",
        path: "/pdf/ppt-to-pdf",
        img: "/images/PPT_to_PDF.png",
    },
    {
        title: "Excel to PDF",
        path: "/pdf/excel-to-pdf",
        img: "/images/excel-to-pdf.png",
    },
    {
        title: "PDF to JPG",
        path: "/pdf/pdf-to-jpg",
        img: "/images/pdf_to_jpg.png",
    },
    {
        title: "Rotate PDF",
        path: "/pdf/rotate-pdf",
        img: "/images/rotate_pdf.png",
    },
    {
        title: "HTML to PDF",
        path: "/pdf/html-to-pdf",
        img: "/images/html_to_pdf.svg",
    },
    {
        title: "Compress PDF",
        path: "/pdf/compress-pdf",
        img: "/images/compress_pdf.webp",
    },
    {
        title: "PDF Viewer",
        path: "/pdf/pdf-viewer",
        img: "/images/pdf-converter-pro-banner.png",
    },
];

const PDFTools = () => {
    return (
        <div>
            <div className="container text-center mt-4">
                <h2 className="fw-bold text-uppercase">ALL POPULAR MODULES</h2>
            </div>

            <div className="row g-0" style={{ marginTop: "20px" }}>
                {pdfTools.map((tool, index) => (
                    <div className="col-md-2 p-0" key={index}>
                        <Link to={tool.path} className="text-decoration-none text-center">
                            <div className="tool-box p-3 shadow-sm rounded">
                                <img
                                    src={tool.img}
                                    alt={tool.title}
                                    style={{ width: "100px", height: "100px" }}
                                    className="mb-2"
                                />
                                <small className="text-dark"><br/>{tool.title}</small>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <br/>
        </div>
    );
};

export default PDFTools;
