// src/pages/Index.js
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "/config/axiosConfig";
import GuestNavbar from "../components/GuestNavbar";
import Footer from "../components/Footer";
import ImageToPDF from "../components/ImageToPDF";
import PdfMerger from "../components/PdfMerger";
import PdfSplitter from "../components/PdfSplitter";
import PdfCompressor from "../components/PdfCompressor";
import PDFZipUpload from "../components/PDFZipUpload";
import PdfToWordConverter from "../components/PdfToTxtConverter";
const Index = () => {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  useEffect(() => { }, []);

  return (
    <div>
      <GuestNavbar />
      <div>
        <div>
          <div className="tools container-1060">
            <div className="tools-top">
              <div className="tools-top__headlines">
                <h1 className="title">
                  All-in-one AI-powered PDF tools, 100% FREE and easy to use!
                </h1>
                <p className="subtitle">
                  Discover a complete suite of PDF tools right at your
                  fingertips! Our services are 100% FREE and incredibly easy to
                  use. Seamlessly merge, split, compress, convert, rotate,
                  unlock, and watermark PDFs with just a few clicks.
                </p>
              </div>

              {/* <div class="tools-top__btn"><a href="/">Use
                  for free</a></div> */}
            </div>
          </div>
        </div>

        {/* <ImageToPDF /> */}

        <section className="content">
  <div className="container">
    <div className="row">
      <div className="col-md-12">
        <div className="content_container">
          <div className="content_box" style={{ border: '2px solid #ddd', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', marginBottom: '20px' }}>
            <Link to="/pdf/margepdf">
              <div className="box_top">
                <div className="top_icon">
                  <img src="/images/PDF.png" alt="pdf" style={{ width: '120px' }} />
                </div>
                <h3>Merge PDF</h3>
                <p>
                  Combine PDFs in the order you want with the easiest PDF merger available.
                </p>
              </div>
            </Link>
          </div>
          <div className="content_box" style={{ border: '2px solid #ddd', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', marginBottom: '20px' }}>
            <Link to="/pdf/splitpdf">
              <div className="box_top">
                <div className="top_icon">
                  <img src="/images/PDF.png" alt="pdf" style={{ width: '120px' }} />
                </div>
                <h3>Split PDF</h3>
                <p>
                  Separate one page or a whole set for easy conversion into independent PDF files.
                </p>
              </div>
            </Link>
          </div>
          <div className="content_box" style={{ border: '2px solid #ddd', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', marginBottom: '20px' }}>
            <Link to="/pdf/pdfzip">
              <div className="box_top">
                <div className="top_icon">
                  <img src="/images/PDF.png" alt="pdf" style={{ width: '120px' }} />
                </div>
                <h3>ZIP PDF</h3>
                <p>
                  Reduce file size while optimizing for maximal PDF quality.
                </p>
              </div>
            </Link>
          </div>
          <div className="content_box" style={{ border: '2px solid #ddd', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', marginBottom: '20px' }}>
            <Link to="/pdf/pdftotxt">
              <div className="box_top">
                <div className="top_icon">
                  <img src="/images/PDF.png" alt="pdf" style={{ width: '120px' }} />
                </div>
                <h3>PDF to Text</h3>
                <p>
                  Easily convert your PDF files into easy to edit txt. The converted txt document is almost 100% accurate.
                </p>
              </div>
            </Link>
          </div>
          <div className="content_box" style={{ border: '2px solid #ddd', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', marginBottom: '20px' }}>
            <Link to="/pdf/pdftoppt">
              <div className="box_top">
                <div className="top_icon">
                  <img src="/images/PDF.png" alt="pdf" style={{ width: '120px' }} />
                </div>
                <h3>PDF to PPT</h3>
                <p>
                  Turn your PDF files into easy to edit PPT and PPTX slideshows.
                </p>
              </div>
            </Link>
          </div>
          <div className="content_box" style={{ border: '2px solid #ddd', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', marginBottom: '20px' }}>
            <Link to="/pdf/imgtopdf">
              <div className="box_top">
                <div className="top_icon">
                  <img src="/images/PDF.png" alt="pdf" style={{ width: '120px' }} />
                </div>
                <h3>Image to PDF</h3>
                <p>
                  Pull data straight from Images to PDF making within seconds.
                </p>
              </div>
            </Link>
          </div>
          {/* Repeat for other boxes... */}
        </div>
      </div>
    </div>
  </div>
</section>

      </div>

     <Footer />  
    </div>
  );
};

export default Index;
