// src/pages/Home.js
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/GuestNavbar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
const Study = () => {
  useEffect(() => {
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.type = "text/css";
    styleLink.href = "/assets/css/course-details.css";
    document.head.appendChild(styleLink);

    return () => {
      document.head.removeChild(styleLink);
    };
  }, []);

  return (
    <>
      <Helmet>
        {" "}
        <title>
          w3programmer - Education, Online Course, Interview Q&A Platform
        </title>
      </Helmet>

     
    </>
  );
};

export default Study;
