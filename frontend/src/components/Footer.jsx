// src/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "../components/css/footer.css";
const Footer = () => {
  return (
    <>
      <footer>
        <div className="container">
          <div className="row">
            {/* About Section */}
            <div className="col-md-4">
              <h5>About Us</h5>
              <p>
                Our AI-powered PDF tools simplify document management with a
                range of features like merging, splitting, and converting PDFs.
                Experience seamless functionality and efficiency—all for free.
              </p>
            </div>

            {/* Modules */}
            <div className="col-md-3">
              <h5>Modules</h5>
              <ul>
                <li>
                  <Link to="/pdf/margepdf">Merge PDF</Link>
                </li>
                <li>
                  <Link to="/pdf/splitpdf">Split PDF</Link>
                </li>
                <li>
                <Link to="/pdf/pdftotxt">PDF To Text</Link>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="col-md-2">
              <h5>Modules</h5>
              <ul>

                <li>
                  <Link to="/pdf/pdftoppt"> PDF to PPT</Link>
                </li>
                <li>
                  <Link to="/pdf/pdfzip">PDF to ZIP</Link>
                </li>
                <li>
                  <Link to="/pdf/imgtopdf"> Image to PDF</Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3">
             
              <p className="contact-info">
                <i className="bi bi-envelope"></i>{" "}
                <a href="mailto:support@twopdf.com" style={{ color: "white" }}>
                  Email: support@twopdf.com
                </a>
              </p>
            </div>
          </div>
          <div className="copyright">
            &copy; {new Date().getFullYear()} All-in-One AI PDF Tools. All
            rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
