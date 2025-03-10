// src/Navbar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";
import axios from "/config/axiosConfig";
import $ from "jquery";

const Navbar = () => {
  const { getToken, token, logout } = AuthUser();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    $(".header-box__mobile-menu").on("click", function () {
      $(".header-content").toggleClass("show");
    });
  }, []);

  const logoutUser = async () => {
    if (token) {
      await logout();
      navigate("/login");
    }
  };

  return (
    <div className="header_main sticky-top z-1">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src="/images/logo.png" className="img-fluid" />
          </Link>
          <div
            className="offcanvas offcanvas-start"
            data-bs-backdrop="static"
            tabIndex={-1}
            id="staticBackdrop"
          >
            <div className="offcanvas-header text-end">
              <button
                type="button"
                className="btn_close ms-auto"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                <i className="fa-solid fa-x" />
              </button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {token && (
                  <li className="nav-item">
                    <Link className="nav-link active" to="/dashboard">
                      My Dashboard
                    </Link>
                  </li>
                )}
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    id="pdfDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    PDF Tools
                  </Link>
                  <ul className="dropdown-menu" aria-labelledby="pdfDropdown">
                    <li>
                      <Link className="dropdown-item" to="/pdf/margepdf">
                        Merge PDF
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/pdf/splitpdf">
                        Split PDF
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/pdf/pdftotxt">
                        PDF to Txt
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/pdf/pdftoppt">
                        PDF to PPT
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/pdf/pdfzip">
                        PDF to ZIP
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/pdf/imgtopdf">
                        Image to PDF
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/pdf/protectpdf">
                        PDF Protect
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/pdf/watermarkpdf">
                       PDF Watermark
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/pdf/word-to-pdf">
                       Word to PDF
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <Link className="nav-link active" to="/about">
                    About Us
                  </Link>
                </li>
                <li className="nav-item d-none">
                  <Link className="nav-link active" to="/pricing">
                    Pricing
                  </Link>
                </li>
              </ul>
              <div className="header-content__buttons">
                {token ? (
                  <>
                    <Link
                      className="header-content__buttons-item"
                      to="/users/profile"
                    >
                      <span>
                        <i className="fa fa-user" /> Profile
                      </span>
                    </Link>
                    <Link
                      className="header-content__buttons-item  mx-2"
                      to="#"
                      onClick={logoutUser}
                    >
                      <span>
                        <i className="fa-regular fa-sign-out" /> Logout
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      className="header-content__buttons-item mx-2"
                      to="/login"
                    >
                      <span>Log In</span>
                    </Link>
                    <Link
                      className="header-content__buttons-item mx-2"
                      to="/signup"
                    >
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            className="btn btn_menu navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#staticBackdrop"
          >
            <i className="fa-solid fa-bars" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
