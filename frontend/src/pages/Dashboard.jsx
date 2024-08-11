import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";
import GuestNavbar from "../components/GuestNavbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const Dashboard = () => {
  const { getToken, token, logout } = AuthUser();
  const { user } = AuthUser();

  const navigate = useNavigate();
  const logoutUser = () => {
    if (token !== undefined) {
      logout();
    }
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
        <title>Welcome to Dashboard</title>
      </Helmet>

      <GuestNavbar />

      {/* Start  */}

      <div>
        {/* dashboard sidebar */}
        <AdminSidebar />
        {/* dashboard main  */}
        <div className="dashboard_main_content">
          <div className="row">
            <div className="col-md-12">
              <div className="dashboar_conent">
                <div className="row">
                  <div className="col-md-12">
                    <h1 className="page_title">
                      Welcome , {user?.name || user?.email}!
                    </h1>
                  </div>
                  <div className="container mt-4">
                    <div className="alert alert-success" role="alert">
                      <h4 className="alert-heading">Welcome to TwoPDF!</h4>
                      <p>
                        We're thrilled to have you on board. At TwoPDF, we're
                        dedicated to making your document management experience
                        seamless and stress-free. With our suite of powerful
                        tools, you can effortlessly merge, convert, compress,
                        and edit your PDF files. Whether you're managing
                        business documents or personal files, our goal is to
                        save you time and boost your productivity. Explore all
                        the features we offer and take your document management
                        to the next level!
                      </p>
                      <hr />
                      <p className="mb-0">
                        If you need any assistance, our support team is here to
                        help. Enjoy your time with TwoPDF and make the most out
                        of our services!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* END */}

      <Footer />
    </>
  );
};

export default Dashboard;
