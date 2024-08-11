import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/GuestNavbar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import axios from "/config/axiosConfig";

const Category = () => {
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

    <div>
  {/* ------------- Header end ----------------  */}
  <div>
    <div className="tools container-1060">
      <div className="tools-top">
        <div className="tools-top__headlines">
          <h2 className="title">Choose the plan that's right for you</h2>
        </div>
      </div>
    </div>
  </div>
  {/* pricing section start here  */}
  <section className="pricing">
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="pricing_container">
            <div className="pricing_box">
              <svg width="122px" height="123px" viewBox="0 0 122 123" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" transform="translate(-372.000000, -311.000000)">
                  <polygon id="Path" fill="currentColor" points="372 311 494 434 372 434" />
                </g>
              </svg>
              <div className="pricing_content_header">
                <h1>Free</h1>
                <h2>$0</h2>
              </div>
              <div className="pricing_body">
                <button type="button" className="btn-primary btn">Get started</button>
                <h6>Free features include:</h6>
                <ul className="feature_list">
                  <li><i className="fa-solid fa-check" />Access to TwoPDF tools</li>
                  <li><i className="fa-solid fa-check" />Limited document processing</li>
                  <li><i className="fa-solid fa-check" />Work on Web</li>
                </ul>
              </div>
            </div>
            <div className="pricing_box premium_plan">
              <svg width="122px" height="123px" viewBox="0 0 122 123" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" transform="translate(-372.000000, -311.000000)">
                  <polygon id="Path" fill="currentColor" points="372 311 494 434 372 434" />
                </g>
              </svg>
              <div className="pricing_content_header">
                <h1>Premium</h1>
                <h2>$4<span>/per month</span></h2>
                <p>Billed annually</p>
                <p>Billed as one payment of $48</p>
              </div>
              <div className="pricing_body">
                <button type="button" className="btn-primary btn">Go Premium</button>
                <h6>Premium features include:</h6>
                <ul className="feature_list">
                  <li><i className="fa-solid fa-check" />Full access to TwoPDF tools</li>
                  <li><i className="fa-solid fa-check" />Unlimited document processing</li>
                  <li><i className="fa-solid fa-check" />Work on Web, Mobile and Desktop</li>
                  <li><i className="fa-solid fa-check" />Convert scanned PDF to Word with OCR, sign with digital signatures, convert to PDF/A</li>
                  <li><i className="fa-solid fa-check" />No Ads</li>
                  <li><i className="fa-solid fa-check" />Customer support</li>
                </ul>
              </div>
            </div>
            <div className="pricing_box">
              <svg width="122px" height="123px" viewBox="0 0 122 123" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" transform="translate(-372.000000, -311.000000)">
                  <polygon id="Path" fill="currentColor" points="372 311 494 434 372 434" />
                </g>
              </svg>
              <div className="pricing_content_header">
                <h1>Business</h1>
                <p><strong>Custom pricing</strong> </p>
                <p>Pricing plan tailored for your business</p>
              </div>
              <div className="pricing_body">
                <button type="button" className="btn-primary btn">Contact Sales</button>
                <h6>Business features include all Premium features plus:</h6>
                <ul className="feature_list">
                  <li><i className="fa-solid fa-check" />Flexible payment options</li>
                  <li><i className="fa-solid fa-check" />Custom contract</li>
                  <li><i className="fa-solid fa-check" />Dedicated customer support</li>
                  <li><i className="fa-solid fa-check" />SSO</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* pricing section end here  */}
</div>


      <Footer />
    </>
  );
};

export default Category;
