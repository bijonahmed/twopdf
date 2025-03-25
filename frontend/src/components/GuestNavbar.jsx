// src/Navbar.js
import React, { useState, useEffect } from "react";
import { NavLink,Link } from "react-router-dom";
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
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src="/images/logo.png" className="img-fluid" alt="Logo" />
        </Link>

        {/* Toggle Button for Offcanvas (Mobile) */}
        <button
          className="btn btn_menu navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#staticBackdrop"
          aria-controls="staticBackdrop"
        >
          <i className="fa-solid fa-bars" />
        </button>

        {/* Offcanvas Sidebar */}
        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="staticBackdrop"
          aria-labelledby="offcanvasLabel"
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
                  <NavLink className="nav-link" to="/dashboard">
                    My Dashboard
                  </NavLink>
                </li>
              )}

              {/* PDF Tools Links */}
              {[
                { path: "/pdf/margepdf", label: "Merge PDF", color: "#FF5733" },
                { path: "/pdf/pdftotxt", label: "PDF to Txt", color: "#C70039" },
                { path: "/pdf/pdftoppt", label: "PDF to PPT", color: "#900C3F" },
                { path: "/pdf/pdfzip", label: "PDF to ZIP", color: "#581845" },
                { path: "/pdf/imgtopdf", label: "Image to PDF", color: "#900C3F" },
                { path: "/pdf/protectpdf", label: "PDF Protect", color: "#FF5733" },
                { path: "/pdf/watermarkpdf", label: "PDF Watermark", color: "#C70039" },
                { path: "/pdf/word-to-pdf", label: "Word to PDF", color: "#581845" },
                { path: "/pdf/ppt-to-pdf", label: "PPT to PDF", color: "#FF4500" },
                { path: "/pdf/excel-to-pdf", label: "Excel to PDF", color: "#32CD32" },
                { path: "/pdf/pdf-to-jpg", label: "PDF to JPG", color: "#FF6347" },
                { path: "/pdf/rotate-pdf", label: "Rotate PDF", color: "#4169E1" },
              ].map((item, index) => (
                <li className="nav-item" key={index}>
                  <NavLink className="nav-link" to={item.path}>
                    <i className="fa-solid fa-file-pdf me-2" style={{ color: item.color }}></i>
                    {item.label}
                  </NavLink>
                </li>
              ))}

              {/* Pricing (Hidden) */}
              <li className="nav-item d-none">
                <NavLink className="nav-link" to="/pricing">
                  Pricing
                </NavLink>
              </li>
            </ul>

            {/* Profile & Auth Buttons */}
            <div className="header-content__buttons">
              {token ? (
                <>
                  <NavLink className="header-content__buttons-item" to="/users/profile">
                    <span>
                      <i className="fa fa-user" /> Profile
                    </span>
                  </NavLink>
                  <button
                    className="header-content__buttons-item mx-2 btn btn-link"
                    onClick={logoutUser}
                  >
                    <span>
                      <i className="fa-regular fa-sign-out" /> Logout
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink className="header-content__buttons-item mx-2" to="/login">
                    <span>Log In</span>
                  </NavLink>
                  <NavLink className="header-content__buttons-item mx-2" to="/signup">
                    <span>Sign Up</span>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
  );
};

export default Navbar;
