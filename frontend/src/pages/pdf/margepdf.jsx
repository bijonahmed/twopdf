import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/GuestNavbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import PdfMerger from "../../components/PdfMerger";
import { useParams } from "react-router-dom";
import axios from "/config/axiosConfig";

const Margepdf = () => {
  const { slug } = useParams();
  // Example SEO data; replace with dynamic data as needed
  const seoData = {
    title: `Marget PDF`,
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
      <PdfMerger/>
      <Footer />
    </>
  );
};

export default Margepdf;
