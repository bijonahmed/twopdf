import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/GuestNavbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import PdfSplitter from "../../components/PdfSplitter";
import { useParams } from "react-router-dom";
import axios from "/config/axiosConfig";

const Splitpdf = () => {
  const { slug } = useParams();
  // Example SEO data; replace with dynamic data as needed
  const seoData = {
    title: `Spilt PDF`,
    description: `At TwoPDF, our mission is to deliver efficient and reliable PDF solutions, so you can focus on what matters. Whether merging, converting, compressing, or editing, TwoPDF simplifies your PDF tasks with easy-to-use tools.`,
    keywords: `Merging, converting, compressing, or editing, TwoPDF`,
  };

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
      </Helmet>
      <GuestNavbar />
      <PdfSplitter/>
      <Footer />
    </>
  );
};

export default Splitpdf;