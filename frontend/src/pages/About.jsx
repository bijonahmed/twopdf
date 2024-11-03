import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/GuestNavbar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import axios from "/config/axiosConfig";

const About = () => {
  const { slug } = useParams();
  // Example SEO data; replace with dynamic data as needed
  const seoData = {
    title: `About us`,
    description: `Our mission is to provide you with the most efficient and reliable PDF solutions, ensuring that you can focus on what truly matters instead of getting bogged down by PDF-related tasks. Whether you need to merge, convert, compress, or edit your PDF files, TwoPDF has got you covered with easy-to-use tools designed to simplify your life.<br/>
Experience the difference with TwoPDF and discover a smarter way to handle your PDF documents. Spend your time well and leave the PDFs to us.`,
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

      <section className="bsb-faq-3 py-3 py-md-5 py-xl-8" style={{ minHeight: '100vh' }}>
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-10 ">
              <h2 className="mb-4 display-8 text-center">About us</h2>
            </div>
          </div>
        </div>
        {/* FAQs: */}
        <div className="mb-8">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-xl-12">
                <p style={{ textAlign: 'justify' }}>
                  At TwoPDF, we're dedicated to making document management effortless for everyone. From firsthand experience, we understand how time-consuming and
                  stressful dealing with PDF files can be. That’s why we've created a suite of tools to streamline your workflow and free up your valuable time. <br />
                  Our mission is to provide you with the most efficient and reliable PDF solutions, ensuring that you can focus on what truly matters instead of getting bogged down by PDF-related tasks. Whether you need to merge, convert, compress, or edit your PDF files, TwoPDF has got you covered with easy-to-use tools designed to simplify your life.<br />
                  Experience the difference with TwoPDF and discover a smarter way to handle your PDF documents. Spend your time well and leave the PDFs to us.<br />
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>


      <Footer />
    </>
  );
};

export default About;
