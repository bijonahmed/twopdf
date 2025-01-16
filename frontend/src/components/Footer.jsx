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
                  <a href="#merge-pdf">Merge PDF</a>
                </li>
                <li>
                  <a href="#split-pdf">Split PDF</a>
                </li>
                <li>
                  <a href="#zip-pdf">ZIP PDF</a>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="col-md-2">
              <h5>Contact Us</h5>
              <ul>
                <li>
                  <a href="#pdf-to-text">PDF to Text</a>
                </li>
                <li>
                  <a href="#pdf-to-ppt">PDF to PowerPoint</a>
                </li>
                <li>
                  <a href="#image-to-pdf">Image to PDF</a>
                </li>
              </ul>
            </div>

            <div className="col-md-3">
              <h5>Contact Us</h5>
              <p className="contact-info">
                <i className="bi bi-envelope"></i> support@example.com
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
