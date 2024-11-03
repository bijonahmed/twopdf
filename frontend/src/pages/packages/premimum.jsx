import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/GuestNavbar";
import Footer from "../../components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import axios from "/config/axiosConfig";
import "../../assets/Premimumcss.css"; // Ensure correct path for CSS

import AuthUser from "../../components/AuthUser";


const Premimum = () => {

  const navigate = useNavigate();
  const { getToken, token, logout } = AuthUser();
  const [loading, setLoading] = useState(false);

  const [monthlyPrice] = useState(4);
  const [yearlyPrice] = useState(48);
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [price, setPrice] = useState(monthlyPrice); // Default to monthly price

  // Handle payment method selection
  const handlePaymentSelection = (method) => {
    const selectedPrice = selectedPlan === "monthly" ? monthlyPrice : yearlyPrice;
    setPrice(selectedPrice);

    if (method === "paypal") {
      handlePaypalPayment(selectedPrice);
    }

    if (method === "stripe") {
      handleStripePayment(selectedPrice);
    }
  };

  // Handle PayPal payment
  const handlePaypalPayment = async (amount) => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const userString = sessionStorage.getItem('user');
    let user = null;
    if (userString) {
        try {
            user = JSON.parse(userString);
        } catch (error) {
            console.error('Failed to parse user from session storage:', error);
        }
    }
    const customerId = user ? user.id : null; // Access the ID property
  //  console.log("customerID:" + userId);

    try {
      // Show the loader
      setLoading(true);
      // Send request to Laravel backend to create a PayPal order
      const response = await axios.post("/auth/payment/createOrder", { customerId,amount, selectedPlan }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Adjust if using multipart/form-data
        },
      });

      // Redirect to PayPal after receiving the response
      window.location.href = response.data.redirectUrl;
      console.log("PayPal Price is:", amount);

      console.log("Return URL:", data.application_context.return_url);
      console.log("Cancel URL:", data.application_context.cancel_url);

      return false;

    } catch (error) {
      console.error("Error creating PayPal order:", error);
    } finally {
      // Hide the loader
      setLoading(false);
    }
  };

  // Stripe 
  const handleStripePayment = async (amount) => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const userString = sessionStorage.getItem('user');
    let user = null;
    if (userString) {
        try {
            user = JSON.parse(userString);
        } catch (error) {
            console.error('Failed to parse user from session storage:', error);
        }
    }
    const customerId = user ? user.id : null; // Access the ID property
  //  console.log("customerID:" + userId);

    try {
      // Show the loader
      setLoading(true);
      // Send request to Laravel backend to create a PayPal order
      const response = await axios.post("/auth/stripe/createOrderStripe", { customerId,amount, selectedPlan }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Adjust if using multipart/form-data
        },
      });


      if (response.data.url) {
        // Redirect to the return URL if needed
        window.location.href = response.data.url;
      } else {
        console.log('No redirect URL provided.');
      }


    } catch (error) {
      console.error("Error creating PayPal order:", error);
    } finally {
      // Hide the loader
      setLoading(false);
    }
  };










  // Handle tab selection
  const handleTabChange = (plan) => {
    setSelectedPlan(plan);
    const newPrice = plan === "monthly" ? monthlyPrice : yearlyPrice;
    setPrice(newPrice);
  };



  const seoData = {
    title: `Packages Premium`,
    description: `Our mission is to provide you with the most efficient and reliable PDF solutions...`,
    keywords: `PDF Pricing`,
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    console.log("Token changed or component mounted");
  }, [token]); // Only re-run effect if token changes

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
          <div className="row justify-content-center">
            <div className="col-12 col-md-10">
              <h2 className="mb-4 text-center">Upgrade to Premium</h2>
            </div>
          </div>
        </div>
        {loading && (
          <div className="loader"></div>
        )}
        <style jsx>{`
        .loader {
  border: 16px solid #e0e0e0; /* Light grey */
  border-top: 16px solid #ff6b6b; /* Red */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 1.5s linear infinite;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
      `}</style>
        <div className="container mt-5">
          <ul className="nav nav-tabs" id="paymentTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <a
                className={`nav-link ${selectedPlan === "monthly" ? "active" : ""}`}
                id="monthly-tab"
                data-bs-toggle="tab"
                href="#monthly"
                role="tab"
                aria-controls="monthly"
                aria-selected={selectedPlan === "monthly"}
                onClick={() => handleTabChange("monthly")}
              >
                Monthly - ${monthlyPrice}
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className={`nav-link ${selectedPlan === "yearly" ? "active" : ""}`}
                id="yearly-tab"
                data-bs-toggle="tab"
                href="#yearly"
                role="tab"
                aria-controls="yearly"
                aria-selected={selectedPlan === "yearly"}
                onClick={() => handleTabChange("yearly")}
              >
                Yearly - ${yearlyPrice}
              </a>
            </li>
          </ul>
          <div className="tab-content mt-3" id="paymentTabsContent">
            <div className="tab-pane fade show active" id="monthly" role="tabpanel" aria-labelledby="monthly-tab">
              <p>Select Monthly Payment - ${monthlyPrice}</p>
              <div id="paypal-button-container"></div>
            </div>
            <div className="tab-pane fade" id="yearly" role="tabpanel" aria-labelledby="yearly-tab">
              <p>Select Yearly Payment - ${yearlyPrice}</p>
              <div id="paypal-button-container"></div>
            </div>
          </div>
          <div className="mt-4 btn-container">
            <button className="btn btn-primary btn-custom" id="paypalButton" onClick={() => handlePaymentSelection("paypal")}>
              Pay with PayPal
            </button>
            <button className="btn btn-dark btn-custom" id="stripeButton" onClick={() => handlePaymentSelection("stripe")}>
              Pay with Stripe
            </button>
            <div id="paypal-button-container"></div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </>
  );
};

export default Premimum;
