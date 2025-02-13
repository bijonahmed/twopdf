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
                  <div className="content_box">
                    <Link to="/pdf/margepdf">
                      <div className="box_top">
                        <div className="top_icon">
                         <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Merge PDF</h3>
                        <p>
                          Combine PDFs in the order you want with the easiest
                          PDF merger available.
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="content_box">
                    <Link to="/pdf/splitpdf">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Split PDF</h3>
                        <p>
                          Separate one page or a whole set for easy conversion
                          into independent PDF files.
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="content_box">
                    <Link to="/pdf/pdfzip">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>ZIP PDF</h3>
                        <p>
                          Reduce file size while optimizing for maximal PDF
                          quality.
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="content_box">
                    <Link to="/pdf/pdftotxt">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>PDF to Text</h3>
                        <p>
                          Easily convert your PDF files into easy to edit txt. The converted txt document is
                          almost 100% accurate.
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="content_box">
                    <Link to="/pdf/pdftoppt">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>PDF to PPT</h3>
                        <p>
                          Turn your PDF files into easy to edit PPT and PPTX
                          slideshows.
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="content_box">
                    <Link to="/pdf/imgtopdf">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Image to PDF</h3>
                        <p>
                          Pull data straight from Images to PDF making within seconds.
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Word to PDF</h3>
                        <p>
                          Make DOC and DOCX files easy to read by converting
                          them to PDF.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf"/>
                        </div>
                        <h3>PowerPoint to PDF</h3>
                        <p>
                          Make PPT and PPTX slideshows easy to view by
                          converting them to PDF.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Excel to PDF</h3>
                        <p>
                          Make EXCEL spreadsheets easy to read by converting
                          them to PDF.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Edit PDF</h3>
                        <p>
                          Add text, images, shapes or freehand annotations to a
                          PDF document. Edit the size, font, and color of the
                          added content.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>PDF to JPG</h3>
                        <p>
                          Convert each PDF page into a JPG or extract all images
                          contained in a PDF.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>PDF to JPG</h3>
                        <p>
                          Convert each PDF page into a JPG or extract all images
                          contained in a PDF.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Sign PDF</h3>
                        <p>
                          Sign yourself or request electronic signatures from
                          others.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Watermark</h3>
                        <p>
                          Stamp an image or text over your PDF in seconds.
                          Choose the typography, transparency and position.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Rotate PDF</h3>
                        <p>
                          Rotate your PDFs the way you need them. You can even
                          rotate multiple PDFs at once!
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>HTML to PDF </h3>
                        <p>
                          Convert webpages in HTML to PDF. Copy and paste the
                          URL of the page you want and convert it to PDF with a
                          click.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Unlock PDF </h3>
                        <p>
                          Remove PDF password security, giving you the freedom
                          to use your PDFs as you want.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Protect PDF </h3>
                        <p>
                          Protect PDF files with a password. Encrypt PDF
                          documents to prevent unauthorized access.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Organize PDF </h3>
                        <p>
                          Sort pages of your PDF file however you like. Delete
                          PDF pages or add PDF pages to your document at your
                          convenience.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>PDF to PDF/A </h3>
                        <p>
                          Transform your PDF to PDF/A, the ISO-standardized
                          version of PDF for long-term archiving. Your PDF will
                          preserve formatting when accessed in the future.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Repair PDF </h3>
                        <p>
                          Repair a damaged PDF and recover data from corrupt
                          PDF. Fix PDF files with our Repair tool.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Page numbers</h3>
                        <p>
                          Add page numbers into PDFs with ease. Choose your
                          positions, dimensions, typography.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Scan to PDF</h3>
                        <p>
                          Capture document scans from your mobile device and
                          send them instantly to your browser.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>OCR PDF</h3>
                        <p>
                          Easily convert scanned PDF into searchable and
                          selectable documents.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Compare PDF</h3>
                        <p>
                          Show a side-by-side document comparison and easily
                          spot changes between different file versions.
                        </p>
                      </div>
                    </a>
                  </div>
                  <div className="content_box d-none">
                    <a href="#">
                      <div className="box_top">
                        <div className="top_icon">
                        <img src="/images/PDF.png" alt="pdf" style={{width: '120px' }}/>
                        </div>
                        <h3>Redact PDF</h3>
                        <p>
                          Redact text and graphics to permanently remove
                          sensitive information from a PDF.
                        </p>
                      </div>
                    </a>
                  </div>
                
                </div>
                <br/>  <br/>
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
