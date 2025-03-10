import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/GuestNavbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import PDFWatermark from "../../components/PDFWatermark";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import axios from "/config/axiosConfig";

const Watermarkpdf = () => {
  const [loading, setLoading] = useState(false);
  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    keywords: "",
    meta_title: "",
    description_full:"",
  });

  const slug = "watermark_pdf";
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/public/checkSeoContent", {
          params: { slug },
        });
        // Assuming API response contains SEO meta data
        if (response.data.seo) {
          setSeoData({
            title: response.data.seo.meta_title || "Image To PDF",
            description: response.data.seo.meta_description || "Default description",
            keywords: response.data.seo.keywords || "default, seo, keywords",
            meta_title: response.data.seo.meta_title || "meta_title",
            description_full: response.data.seo.description_full || "description_full",
          });
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [slug]);
  // Get the base domain dynamically
  const baseUrl = window.location.href;
  const canonicalUrl = `${baseUrl}`;

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <GuestNavbar />
      {/* <ProtectPDF /> */}

      {loading ? (
        // Loader (replace with any spinner or animation component)
        <Loader />
      ) : (
        <PDFWatermark description={seoData} />
      )}

      <Footer />
    </>
  );
};

export default Watermarkpdf;
