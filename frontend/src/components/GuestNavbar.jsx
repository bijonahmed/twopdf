// src/Navbar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";
import axios from "/config/axiosConfig";
// import "../components/css/navbarcss.css";
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
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src="/images/logo.png" className="img-fluid" alt="Logo" />
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
                    <Link className="nav-link" to="/dashboard" activeClassName="active-link">
                      My Dashboard
                    </Link>
                  </li>
                )}

<li className="nav-item">
  <Link className="nav-link" to="/pdf/margepdf" activeClassName="active-link">
    <i className="fa-solid fa-file-pdf me-2" style={{ color: '#FF5733' }}></i> Merge PDF
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/pdf/pdftotxt" activeClassName="active-link">
    <i className="fa-solid fa-file-pdf me-2" style={{ color: '#C70039' }}></i> PDF to Txt
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/pdf/pdftoppt" activeClassName="active-link">
    <i className="fa-solid fa-file-pdf me-2" style={{ color: '#900C3F' }}></i> PDF to PPT
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/pdf/pdfzip" activeClassName="active-link">
    <i className="fa-solid fa-file-pdf me-2" style={{ color: '#581845' }}></i> PDF to ZIP
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/pdf/imgtopdf" activeClassName="active-link">
    <i className="fa-solid fa-file-pdf me-2" style={{ color: '#900C3F' }}></i> Image to PDF
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/pdf/protectpdf" activeClassName="active-link">
    <i className="fa-solid fa-file-pdf me-2" style={{ color: '#FF5733' }}></i> PDF Protect
  </Link>
</li>

<li className="nav-item">
  <Link className="nav-link" to="/pdf/watermarkpdf" activeClassName="active-link">
    <i className="fa-solid fa-file-pdf me-2" style={{ color: '#C70039' }}></i> PDF Watermark
  </Link>
</li>

<li className="nav-item">
  <Link className="nav-link" to="/pdf/word-to-pdf" activeClassName="active-link">
    <i className="fa-solid fa-file-pdf me-2" style={{ color: '#581845' }}></i> Word to PDF
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/pdf/ppt-to-pdf" activeClassName="active-link">
    <i className="fa-solid fa-file-pdf me-2" style={{ color: '#FF4500' }}></i> PPT to PDF
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/pdf/excel-to-pdf" activeClassName="active-link">
    <i className="fa-solid fa-file-pdf me-2" style={{ color: '#32CD32' }}></i> Excel to PDF
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/pdf/pdf-to-jpg" activeClassName="active-link">
    <i className="fa-solid fa-file-pdf me-2" style={{ color: '#FF6347' }}></i> PDF to JPG
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/pdf/rotate-pdf" activeClassName="active-link">
    <i className="fa-solid fa-file-pdf me-2" style={{ color: '#4169E1' }}></i> Rotate PDF
  </Link>
</li>

               



                <li className="nav-item d-none">
                  <Link className="nav-link" to="/pricing" activeClassName="active-link">
                    Pricing
                  </Link>
                </li>
              </ul>
              <div className="header-content__buttons">
                {token ? (
                  <>
                    <Link className="header-content__buttons-item" to="/users/profile">
                      <span>
                        <i className="fa fa-user" /> Profile
                      </span>
                    </Link>
                    <Link
                      className="header-content__buttons-item mx-2"
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
                    <Link className="header-content__buttons-item mx-2" to="/login">
                      <span>Log In</span>
                    </Link>
                    <Link className="header-content__buttons-item mx-2" to="/signup">
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
