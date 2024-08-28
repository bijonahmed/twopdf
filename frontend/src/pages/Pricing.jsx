import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/GuestNavbar";
import Footer from "../components/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "/config/axiosConfig";
import AuthUser from "../components/AuthUser";

const Pricing = () => {
  const { getToken, token } = AuthUser();
  const [selectedPayment, setSelectedPayment] = useState(""); // Correctly placed inside the component
  const { slug } = useParams();

  // Example SEO data; replace with dynamic data as needed
  const seoData = {
    title: `Pricing`,
    description: `Our mission is to provide you with the most efficient and reliable PDF solutions, ensuring that you can focus on what truly matters instead of getting bogged down by PDF-related tasks. Whether you need to merge, convert, compress, or edit your PDF files, TwoPDF has got you covered with easy-to-use tools designed to simplify your life.<br/>
Experience the difference with TwoPDF and discover a smarter way to handle your PDF documents. Spend your time well and leave the PDFs to us.`,
    keywords: `${slug}, courses, tutorials, My Awesome Website`,
  };

  const handlePaymentSelection = (method) => {
    setSelectedPayment(method);

    if (method === "paypal") {
      const price = 100; // Example price value, replace with your actual value
      handlePaypalPayment(price);
    }

    if (method === "stripe") {
      const price = 100; // Example price value, replace with your actual value
      handleStripePayment(price);
    }
  };

  const handlePaypalPayment = (price) => {
    console.log("Paypal Price......" + price);
    // Your PayPal API integration logic here
  };

  const handleStripePayment = (price) => {
    console.log("Paypal Price......" + price);
    // Your PayPal API integration logic here
  };
 

  const [monthlyPrice] = useState(4);
  const [yearlyPrice] = useState(48);

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
                    <svg
                      width="122px"
                      height="123px"
                      viewBox="0 0 122 123"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <g
                        stroke="none"
                        strokeWidth={1}
                        fill="none"
                        fillRule="evenodd"
                        transform="translate(-372.000000, -311.000000)"
                      >
                        <polygon
                          id="Path"
                          fill="currentColor"
                          points="372 311 494 434 372 434"
                        />
                      </g>
                    </svg>
                    <div className="pricing_content_header">
                      <h1>Free </h1>
                      <h2>$0</h2>
                    </div>
                    <div className="pricing_body">
                      <button type="button" className="btn-primary btn">
                        Get started
                      </button>
                      <h6>Free features include:</h6>
                      <ul className="feature_list">
                        <li>
                          <i className="fa-solid fa-check" />
                          Access to TwoPDF tools
                        </li>
                        <li>
                          <i className="fa-solid fa-check" />
                          Limited document processing
                        </li>
                        <li>
                          <i className="fa-solid fa-check" />
                          Work on Web
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pricing_box premium_plan">
                    <svg
                      width="122px"
                      height="123px"
                      viewBox="0 0 122 123"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <g
                        stroke="none"
                        strokeWidth={1}
                        fill="none"
                        fillRule="evenodd"
                        transform="translate(-372.000000, -311.000000)"
                      >
                        <polygon
                          id="Path"
                          fill="currentColor"
                          points="372 311 494 434 372 434"
                        />
                      </g>
                    </svg>
                    <div className="pricing_content_header">
                      <h1>Premium</h1>
                      <h2>
                        ${monthlyPrice}
                        <span>/per month</span>
                      </h2>
                      <p>Billed annually</p>
                      <p>Billed as one payment of ${yearlyPrice}</p>
                    </div>


                  
                    <div className="pricing_body">


                   

                    {token ? (
                        <button type="button" className="btn-primary btn">
                          <Link to="/premimum-packages" style={{ color: "white" }} > Go Premium </Link>
                        </button>
                      ) : (
                        <button type="button" className="btn-primary btn">
                          <Link to="/user-login" style={{ color: "white" }}>
                            Go Premium
                          </Link>
                        </button>
                      )}

                      <h6>Premium features include:</h6>
                      <ul className="feature_list">
                        <li>
                          <i
                            className="fa-solid fa-check"
                            style={{ fontSize: "8px" }}
                          />
                          Advanced encryption for secure documents
                        </li>
                        <li>
                          <i
                            className="fa-solid fa-check"
                            style={{ fontSize: "8px" }}
                          />
                          Priority processing for faster results
                        </li>
                        <li>
                          <i
                            className="fa-solid fa-check"
                            style={{ fontSize: "8px" }}
                          />
                          Integration with cloud storage services
                        </li>
                        <li>
                          <i
                            className="fa-solid fa-check"
                            style={{ fontSize: "8px" }}
                          />
                          Batch processing for multiple documents
                        </li>
                        <li>
                          <i
                            className="fa-solid fa-check"
                            style={{ fontSize: "8px" }}
                          />
                          Customizable settings and preferences
                        </li>
                        <li>
                          <i
                            className="fa-solid fa-check"
                            style={{ fontSize: "8px" }}
                          />
                          Offline access to tools and features
                        </li>
                        <li>
                          <i
                            className="fa-solid fa-check"
                            style={{ fontSize: "8px" }}
                          />
                          Regular updates and new feature releases
                        </li>
                        <li>
                          <i
                            className="fa-solid fa-check"
                            style={{ fontSize: "8px" }}
                          />
                          Access to exclusive templates and tools
                        </li>
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

export default Pricing;
