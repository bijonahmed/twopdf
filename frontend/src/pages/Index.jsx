// src/pages/Index.js
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "/config/axiosConfig";
import GuestNavbar from "../components/GuestNavbar";
import TwoPDFSolutions from "../components/TwoPDFSolutions";
import Footer from "../components/Footer";
import "../components/css/Index.css";
const Index = () => {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  useEffect(() => {}, []);

  return (
    <div>
      <GuestNavbar />
      <div>
        <div>
          <div className="tools container-1060">
            <div className="tools-top">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="tools-top__headlines">
                    <h1 className="title">
                      All-in-one AI-powered PDF tools, 100% FREE and easy to
                      use!
                    </h1>
                    <p className="subtitle">
                      Discover a complete suite of PDF tools right at your
                      fingertips! Our services are 100% FREE and incredibly easy
                      to use. Seamlessly merge, split, compress, convert,
                      rotate, unlock, and watermark PDFs with just a few clicks.
                    </p>
                  </div>
                </div>
              </div>

               
            </div>
          </div>
        </div>

        {/* <ImageToPDF /> */}

        <section className="content">
          <div className="container">
            <div className="row" style={{ marginTop: "-50px" }}>
              <div className="col-md-12">
                <div className="content_container">
                  <div
                    className="content_box">
                    <Link to="/pdf/margepdf">
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img
                            src="/images/merge_pdf.png"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>Merge PDF</h3>
                        <p>
                          Combine PDFs in the order you want with the easiest
                          PDF merger available.
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div
                    className="content_box">
                    <Link to="/pdf/splitpdf">
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img
                            src="/images/spilt_pdf.webp"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>Split PDF</h3>
                        <p>
                          Separate one page or a whole set for easy conversion
                          into independent PDF files.
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div
                    className="content_box">
                    <Link to="/pdf/pdfzip">
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img
                            src="/images/zip_pdf.png"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>ZIP PDF</h3>
                        <p>
                          Reduce file size while optimizing for maximal PDF
                          quality.
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div
                    className="content_box">
                    <Link to="/pdf/pdftotxt">
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img
                            src="/images/pdf-to-txt.png"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>PDF to Text</h3>
                        <p>
                          Easily convert your PDF files into easy to edit txt.
                          The document is almost 100% accurate.
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div
                    className="content_box">
                    <Link to="/pdf/pdftoppt">
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img
                            src="/images/pdf_to_ppt.png"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>PDF to PPT</h3>
                        <p>
                          Turn your PDF files into easy to edit PPT and PPTX
                          slideshows.
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div
                    className="content_box">
                    <Link to="/pdf/imgtopdf">
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img
                            src="/images/image_to_pdf.png"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>Image to PDF</h3>
                        <p>
                          Pull data straight from Images to PDF making within
                          seconds.
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div
                    className="content_box">
                    <Link to="/pdf/protectpdf">
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img
                            src="/images/proted_pdf.png"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>Protect PDF </h3>
                        <p>
                          Protect PDF files with a password.  PDF
                          documents unauthorized access.
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div
                    className="content_box">
                    <Link to="/pdf/watermarkpdf">
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img
                            src="/images/watermark_pdf.png"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>Watermark</h3>
                        <p>
                          Stamp an image or text over your PDF in seconds.
                  
                        </p>
                      </div>
                    </Link>
                  </div>
                  {/* Repeat for other boxes... */}

                  <div
                    className="content_box">
                    <Link to="/pdf/word-to-pdf">
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img
                            src="/images/word-to-pdf.png"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>Word to PDF</h3>
                        <p>
                          Make DOC and DOCX files easy to read by converting
                          them to PDF.
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div
                    className="content_box">
                    <Link to="/pdf/ppt-to-pdf">
                      <div className="box_top">
                        <div className="top_icon mt-4">
                          <img

                            src="/images/PPT_to_PDF.png"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>PPT to PDF</h3>
                        <p>
                          Make PPT and PPTX slideshows easy to view by
                          converting them to PDF.
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div
                    className="content_box">
                    <Link to="/pdf/excel-to-pdf">
                      <div className="box_top">
                        <div className="top_icon mt-4">
                          <img
                            src="/images/excel-to-pdf.png"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>Excel to PDF</h3>
                        <p>
                          Make EXCEL spreadsheets easy to read by converting
                          them to PDF.
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div
                    className="content_box">
                    <Link to="/pdf/pdf-to-jpg">
                      <div className="box_top">
                        <div className="top_icon">
                          <img
                            src="/images/pdf_to_jpg.png"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>PDF to JPG</h3>
                        <p>
                          Convert each PDF page into a JPG or extract all images
                          contained in a PDF.
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div
                    className="content_box">
                    <Link to="/pdf/rotate-pdf">
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img
                            src="/images/rotate_pdf.png"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>Rotate PDF</h3>
                        <p>
                          Rotate your PDFs the way you need them. You can even
                          rotate multiple PDFs at once!
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div
                    className="content_box">
                     <Link to="/pdf/html-to-pdf">
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img
                            src="/images/html_to_pdf.svg"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>HTML to PDF </h3>
                        <p>
                          Convert webpages in HTML to PDF. Copy and paste the
                          URL of the page.
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div className="content_box">
                  <Link to="/pdf/compress-pdf">
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img
                            src="/images/compress_pdf.webp" alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>Compress PDF</h3>
                        <p>
                        Convert your PDF to PDF/A for long-term use. Keep formatting intact for future access.
                        </p>
                      </div>
                    </Link>
                  </div>



                  <div className="content_box">
                  <Link to="/pdf/pdf-viewer">
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img
                            src="/images/pdf-converter-pro-banner.png"
                            alt="pdf"
                            style={{ width: "120px" }}
                          />
                        </div>
                        <h3>PDF Viewer</h3>
                        <p>
                          Remove PDF password security, giving you the freedom
                          to use your PDFs as you want.
                        </p>
                      </div>
                    </Link>
                  </div>

                  
                  
                </div>
              </div>
              <TwoPDFSolutions/>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
