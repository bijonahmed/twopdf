// src/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "../components/css/footer.css";
import {
  FaXTwitter,
  FaInstagram,
  FaPinterest,
  FaFacebook,
} from "react-icons/fa6";
const Footer = () => {
  return (
    <>
      <footer className="footer bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            {/* About Section */}
            <div className="col-md-6">
              <h5 className="text-uppercase">About Us</h5>
              <p>
                Our AI-powered PDF tools simplify document management with a
                range of features like merging, splitting, and converting PDFs.
                Experience seamless functionality and efficiency—all for free.
              </p>
            </div>

            {/* Social Links */}
            <div className="col-md-3">
              <h5 className="text-uppercase">Follow Us</h5>
              <ul className="list-unstyled d-flex gap-3">
                <li>
                  <a
                    href="https://x.com/twopdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                  >
                    <FaXTwitter size={24} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/twopdf/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                  >
                    <FaInstagram size={24} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.pinterest.com/twopdf/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                  >
                    <FaPinterest size={24} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://web.facebook.com/twopdf/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                  >
                    <FaFacebook size={24} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom Section */}
          <div
            className="text-center mt-3 pt-3"
            style={{ borderTop: "1px solid rgb(56, 56, 58)" }}
          >
            <p className="mb-2">
              📧{" "}
              <a href="mailto:support@twopdf.com" className="text-white">
                support@twopdf.com
              </a>
            </p>
            <small>
              &copy; {new Date().getFullYear()} All-in-One AI PDF Tools. All
              rights reserved.{" "}
              <a href="/privacy-policy" className="text-white">
                Privacy Policy
              </a>
            </small>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
