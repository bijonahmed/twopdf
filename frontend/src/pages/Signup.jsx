// src/pages/Home.js
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/GuestNavbar";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "/config/axiosConfig";

const Signup = () => {


  const navigate = useNavigate();
  const [name, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // Define errors state

  const handleBrandNameChange = (e) => {
    setBrandName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/auth/register", {
        name,
        email,
        password,
      });
      console.log(response.data.message);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation errors:", error.response.data.errors);
        setErrors(error.response.data.errors);
      } else {
        console.error("Error adding brand:", error);
      }
    }
  };
  return (
    <>
      <Helmet>
        {" "}
        <title> Signup</title>
      </Helmet>

      <GuestNavbar />



      <div className="container" style={{ minHeight: '100vh' }}>
        <div className="row">
          <div className="col-md-5 m-auto">
            <div className="login_sec register_sec">
              <h1>Create an account</h1>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group mb-3">
                      <label>Name</label>
                      <input
                        className="form-control"
                        type="text"
                        id="name"
                        value={name}
                        onChange={handleBrandNameChange}
                      />
                      {errors.name && (
                        <div className="error" style={{ color: "red" }}>
                          {errors.name[0]}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group mb-3">
                      <label>Email</label>
                      <input
                        className="form-control"
                        type="text"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                      />
                      {errors.email && (
                        <div className="error" style={{ color: "red" }}>
                          {errors.email[0]}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
                <div className="form-group mb-2">
                  <label>Password</label>
                  <div className="input_group">
                    <input
                      className="form-control"
                      type="password"
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    {errors.password && (
                      <div className="error" style={{ color: "red" }}>
                        {errors.password[0]}
                      </div>
                    )}
                  </div>
                </div>
                <button className="btn btn-primary btn-primary--login"> Log In </button>
                <p><span>By signing up you agree to  <Link to="/terms-and-conditions">Terms and Conditions</Link> and <Link to="/privacy-policy">Privacy Policy</Link></span></p>
              </form>
              <div className="signup"><span>Already have an account? </span> <Link to="/login" className="register-link">
                Log In
              </Link></div>
            </div>
          </div>
        </div>
      </div>



      <Footer />
    </>
  );
};

export default Signup;
