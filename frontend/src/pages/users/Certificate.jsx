import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/GuestNavbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "/config/axiosConfig";
import Swal from 'sweetalert2';

const Certificate = () => {

  const navigate = useNavigate();
 
  const [old_password, setOldPasswordName] = useState("");
  const [new_password, setNewPasswordName] = useState("");
  const [new_password_confirmation, setConfirmPasswordName] = useState("");
  const [errors, setErrors] = useState({});


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const formData = new FormData();
      formData.append('old_password', old_password);
      formData.append('new_password', new_password);
      formData.append('new_password_confirmation', new_password_confirmation);
      const response = await axios.post('/auth/updatePassword', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: 'Has been successfully update'
      });
      //console.log(response.data.message);
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Errors',
            html: Object.values(error.response.data.errors).map(err => `<div>${err.join('<br>')}</div>`).join(''),
          });
        console.error('Validation errors:', error.response.data.errors);
        setErrors(error.response.data.errors);
      } else {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleOldPasswordChange = (e) => {
    setOldPasswordName(e.target.value);
  };
  const handleNewPasswordChange = (e) => {
    setNewPasswordName(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPasswordName(e.target.value);
  };
  

  useEffect(() => {
  
  }, []);

  return (
    <>
      <Helmet>
        <title>w3programmer - Change Password</title>
      </Helmet>

      <div className="page_wrapper">
        {/* Back To Top - Start */}
        <div className="backtotop">
          <a href="#" className="scroll">
            <i className="far fa-arrow-up" />
            <i className="far fa-arrow-up" />
          </a>
        </div>
        <GuestNavbar />

        <br />
        <br />

        <section className="page_banner decoration_wrap">
          <div className="container">
            <ul className="breadcrumb_nav unordered_list_center">
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>Certificate</li>
            </ul>
          </div>
        </section>

        <main className="page_content">
          
          <section   className="container banner_section banner_style_4"
            style={{ backgroundColor: "rgba(234, 232, 230, 0.95)", borderRadius: 10 }}>
            <div className="container">
            <b>Description for Upcoming Certificate Features on w3programmer</b><br/>
            Upcoming Certificate Features on w3programmer:

At w3programmer, we are excited to introduce our upcoming certificate features designed to enhance your learning experience and professional credentials. Here's a sneak peek at what's coming:<br/>
1.Personalized Certificates<br/>
2.Digital Verification<br/>

            </div>
          </section>  
        </main>
        <br/>

        <Footer />
      </div>
    </>
  );
};

export default Certificate;
