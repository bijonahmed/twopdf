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

    <section className="bsb-faq-3 py-3 py-md-5 py-xl-8">
  <div className="container">
    <div className="row justify-content-md-center">
      <div className="col-12 col-md-10 ">
        <h2 className="mb-4 display-5 text-center">Frequently Asked Questions</h2>
      </div>
    </div>
  </div>
  {/* FAQs: */}
  <div className="mb-8">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-xl-10">
            <div className="accordion accordion-flush" id="faqAccount">
              
              <div className="accordion-item bg-transparent border-top border-bottom py-3">
                <h2 className="accordion-header" id="faqAccountHeading1">
                  <button className="accordion-button collapsed bg-transparent fw-bold shadow-none text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#faqAccountCollapse1" aria-expanded="false" aria-controls="faqAccountCollapse1">
                    Can I try TwoPDF before I subscribe?
                  </button>
                </h2>
                <div id="faqAccountCollapse1" className="accordion-collapse collapse" aria-labelledby="faqAccountHeading1">
                  <div className="accordion-body">
                    <p>As a free user, you have limited access to all our tools. By upgrading to Premium, you get access to the same tools with the highest task and size limits.</p>
                  </div>
                </div>
              </div>
              
              <div className="accordion-item bg-transparent border-top border-bottom py-3">
                <h2 className="accordion-header" id="faqAccountHeading2">
                  <button className="accordion-button collapsed bg-transparent fw-bold shadow-none text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#faqAccountCollapse2" aria-expanded="false" aria-controls="faqAccountCollapse2">
                    Is there a discount for multiple user accounts?
                  </button>
                </h2>
                <div id="faqAccountCollapse2" className="accordion-collapse collapse" aria-labelledby="faqAccountHeading2">
                  <div className="accordion-body">
                    <p>TwoPDF offers competitive pricing. For up to 10 users, we provide an annual membership discount of 33% off. For larger volumes of user accounts, please contact us for special rates.</p>
                  </div>
                </div>
              </div>
              
              <div className="accordion-item bg-transparent border-top border-bottom py-3">
                <h2 className="accordion-header" id="faqAccountHeading3">
                  <button className="accordion-button collapsed bg-transparent fw-bold shadow-none text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#faqAccountCollapse3" aria-expanded="false" aria-controls="faqAccountCollapse3">
                    Can I share a single billing for multiple accounts?
                  </button>
                </h2>
                <div id="faqAccountCollapse3" className="accordion-collapse collapse" aria-labelledby="faqAccountHeading3">
                  <div className="accordion-body">
                    <p>Yes, you can share a single billing for multiple accounts. This option is ideal for teams and businesses that need multiple users to access TwoPDF's tools.</p>
                  </div>
                </div>
              </div>
              
              <div className="accordion-item bg-transparent border-top border-bottom py-3">
                <h2 className="accordion-header" id="faqAccountHeading4">
                  <button className="accordion-button collapsed bg-transparent fw-bold shadow-none text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#faqAccountCollapse4" aria-expanded="false" aria-controls="faqAccountCollapse4">
                    What payment methods do you accept?
                  </button>
                </h2>
                <div id="faqAccountCollapse4" className="accordion-collapse collapse" aria-labelledby="faqAccountHeading4">
                  <div className="accordion-body">
                    <p>We accept various payment methods including credit cards, PayPal, and bank transfers. For more details on payment options, please visit our payment information page or contact our support team.</p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
</section>


      <Footer />
    </>
  );
};

export default Category;
