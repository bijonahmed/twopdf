import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/GuestNavbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy</title>
      </Helmet>

      <GuestNavbar />

      <section className="bsb-faq-3 py-3 py-md-5 py-xl-8">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-10 ">
              <h6 className="mb-4 display-8 text-center">
                Terms and conditions
              </h6>
            </div>
          </div>
        </div>
        {/* FAQs: */}
        <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10">
          <p>Welcome to TwoPDF! By using our services, you agree to the following terms and conditions. Please read them carefully.</p>
          
          <h6 className="mt-4">1. Acceptance of Terms</h6>
          <p>By accessing and using TwoPDF, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, you are not authorized to use or access TwoPDF.</p>
          
          <h6 className="mt-4">2. Description of Service</h6>
          <p>TwoPDF provides users with a variety of tools to manage and manipulate PDF files, including but not limited to merging, converting, compressing, and editing PDFs.</p>
          
          <h6 className="mt-4">3. User Responsibilities</h6>
          <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.</p>
          
          <h6 className="mt-4">4. Prohibited Uses</h6>
          <p>Users are prohibited from using TwoPDF for any unlawful purpose or any purpose prohibited by these terms and conditions. You may not use the service to:</p>
          <ul>
            <li>Upload or transmit any content that is unlawful, harmful, threatening, abusive, or otherwise objectionable</li>
            <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity</li>
            <li>Upload or transmit any material that contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software or hardware</li>
          </ul>
          
          <h6 className="mt-4">5. Intellectual Property</h6>
          <p>All content included on this site, such as text, graphics, logos, images, and software, is the property of TwoPDF or its content suppliers and is protected by international copyright laws.</p>
          
          <h6 className="mt-4">6. Termination</h6>
          <p>We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the terms.</p>
          
          <h6 className="mt-4">7. Changes to the Terms</h6>
          <p>TwoPDF reserves the right to modify these terms and conditions at any time. Your continued use of the site following any changes indicates your acceptance of the new terms and conditions.</p>
          
          <h6 className="mt-4">8. Contact Us</h6>
          <p>If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:support@twopdf.com">support@twopdf.com</a>.</p>
        </div>
      </div>
    </div>
      </section>

      <Footer />
    </>
  );
};

export default TermsAndConditions;
