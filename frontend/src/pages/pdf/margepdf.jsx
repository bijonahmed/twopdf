import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/GuestNavbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import PdfMerger from "../../components/PdfMerger";
import { useParams } from "react-router-dom";
import axios from "/config/axiosConfig";

const Category = () => {
  const { slug } = useParams();
  // Example SEO data; replace with dynamic data as needed
  const seoData = {
    title: `Marget PDF`,
    description: `Explore courses and tutorials in the ${slug} category on My Awesome Website.`,
    keywords: `${slug}, courses, tutorials, My Awesome Website`,
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

export default Category;
