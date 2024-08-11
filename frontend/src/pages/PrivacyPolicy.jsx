import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/GuestNavbar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";

const PrivacyPolicy = () => {
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
        <title>Privacy Policy</title>
      </Helmet>

      <GuestNavbar />

      <section className="bsb-faq-3 py-3 py-md-5 py-xl-8">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-10 ">
              <h6 className="mb-4 display-8 text-center">Privacy Policy</h6>
            </div>
          </div>
        </div>
        {/* FAQs: */}
        <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10">
          <p>
            Welcome to TwoPDF! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our services.
          </p>
          
          <h6 className="mt-4">Information We Collect</h6>
          <p>
            We collect information to provide better services to our users. The types of information we collect include:
          </p>
          <ul>
            <li><strong>Personal Information:</strong> When you sign up for an account, we collect personal information such as your name, email address, and payment information.</li>
            <li><strong>Usage Data:</strong> We collect information about how you use our services, including the types of files you process and the features you use.</li>
            <li><strong>Device Information:</strong> We collect information about the devices you use to access our services, including hardware models, operating systems, and browser types.</li>
          </ul>
          
          <h6 className="mt-4">How We Use Information</h6>
          <p>
            We use the information we collect for the following purposes:
          </p>
          <ul>
            <li>To provide, maintain, and improve our services</li>
            <li>To process transactions and send you related information</li>
            <li>To communicate with you, including sending updates and promotional offers</li>
            <li>To monitor and analyze usage and trends</li>
            <li>To personalize your experience</li>
            <li>To enforce our terms and conditions</li>
          </ul>
          
          <h6 className="mt-4">How We Share Information</h6>
          <p>
            We do not share your personal information with third parties except in the following circumstances:
          </p>
          <ul>
            <li>With your consent</li>
            <li>For external processing with trusted partners who comply with our privacy policies</li>
            <li>For legal reasons, such as complying with laws and regulations or responding to legal processes</li>
          </ul>
          
          <h6 className="mt-4">Data Security</h6>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the internet or method of electronic storage is 100% secure.
          </p>
          
          <h6 className="mt-4">Your Choices</h6>
          <p>
            You have choices regarding the information we collect and how it is used. You can:
          </p>
          <ul>
            <li>Update or correct your account information</li>
            <li>Opt-out of receiving promotional emails</li>
            <li>Delete your account</li>
          </ul>
          
          <h6 className="mt-4">Changes to This Privacy Policy</h6>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website.
          </p>
          
          <h6 className="mt-4">Contact Us</h6>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@twopdf.com">privacy@twopdf.com</a>.
          </p>
        </div>
      </div>
    </div>
      </section>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
