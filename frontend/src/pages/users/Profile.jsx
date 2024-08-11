import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/GuestNavbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "/config/axiosConfig";
import AdminSidebar from "../../components/AdminSidebar";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Add loading state
  const [nationality_id, setnationality_id] = useState("");
  const [countrys, setCountry] = useState([]);
  const [w3_address, setw3Address] = useState("");
  const [fname, setUserFName] = useState("");
  const [lname, setUserlName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [inviteCode, setinviteCode] = useState("");
  const [image, setImage] = useState("");
  const [whtsapp, setWhtsapp] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const formData = new FormData();
      formData.append("nationality_id", nationality_id);
      formData.append("fname", fname);
      formData.append("lname", lname);
      formData.append("email", email);
      formData.append("phone_number", phone_number);
      formData.append("whtsapp", whtsapp);
      if (image) {
        formData.append("file", image);
      }

      const response = await axios.post("/user/updateUser", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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
        },
      });
      Toast.fire({
        icon: "success",
        title: "Has been successfully update",
      });

      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        Swal.fire({
          icon: "error",
          title: "Validation Errors",
          html: Object.values(error.response.data.errors)
            .map((err) => `<div>${err.join("<br>")}</div>`)
            .join(""),
        });
        console.error("Validation errors:", error.response.data.errors);
        setErrors(error.response.data.errors);
      } else {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleFnameChange = (e) => {
    setUserFName(e.target.value);
  };
  const handleLnameChange = (e) => {
    setUserlName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };
  const handleWhatsAppChange = (e) => {
    setWhtsapp(e.target.value);
  };

  const handlePicChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleChange = (event) => {
    setnationality_id(event.target.value);
  };

  const handleInviteCodeChange = (e) => {
    setinviteCode(e.target.value);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const token = JSON.parse(sessionStorage.getItem("token")); // Retrieve the token from local storage
        const response = await axios.get("/user/checkCurrentUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        //console.log("response", response.data.country);
        setw3Address(response.data.user.w3_id);
        setUserFName(response.data.user.f_name);
        setUserlName(response.data.user.l_name);
        setEmail(response.data.user.email);
        setPhoneNumber(response.data.user.phone_number);
        setinviteCode(response.data.user.inviteCode);
        setWhtsapp(response.data.user.whtsapp);
        setnationality_id(response.data.user.nationality_id);
        setImage(response.data.image);
        setTimeout(() => {
          setCountry(response.data.country);
        }, 1000);

        //setStatus(response.data.data.status.toString());
      } catch (error) {
        console.error("Error fetching brand data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>

      <GuestNavbar />
      <AdminSidebar />
      {/* Start  */}

      <div className="dashboard_main_content">
        <div className="row">
          <div className="col-md-12">
            <div className="dashboar_conent">
              <div className="row">
                <div className="col-md-12">
                  <h1 className="page_title">My account</h1>
                </div>
                <div className="col-md-6">
                  <div className="profile_card">
                    <div className="card_header">
                      <h4>Profile</h4>
                    
                    </div>
                    {loading ? (
                      <center>
                        <div className="spinner-border" />
                      </center>
                    ) : (
                      <section
                        className="container banner_section banner_style_4 mouse_move"
                        style={{
                          backgroundColor: "rgba(234, 232, 230, 0.95)",
                          borderRadius: 10,
                        }}
                      >
                        <div className="container">
                          <form className="row g-3" onSubmit={handleSubmit}>
                            <div className="col-md-12">
                              <label
                                className="form-label"
                              >
                                ID:
                              </label>
                              {w3_address}
                            </div>

                            <div className="col-md-6">
                              <label
                                className="form-label"
                              >
                                First Name
                              </label>
                              <input
                                type="text"
                                value={fname}
                                className="form-control"
                                onChange={handleFnameChange}
                              />
                              {errors.fname && (
                                <div className="error" style={{ color: "red" }}>
                                  {errors.fname[0]}{" "}
                                </div>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label
                                className="form-label"
                              >
                                Last Name
                              </label>
                              <input
                                type="text"
                                value={lname}
                                className="form-control"
                                onChange={handleLnameChange}
                              />
                              {errors.lname && (
                                <div className="error" style={{ color: "red" }}>
                                  {errors.lname[0]}{" "}
                                </div>
                              )}
                            </div>

                            <div className="col-md-6">
                              <label
                                className="form-label"
                              >
                                Email
                              </label>
                              <input
                                type="text"
                                value={email}
                                className="form-control"
                                onChange={handleEmailChange}
                              />
                              {errors.email && (
                                <div className="error" style={{ color: "red" }}>
                                  {errors.email[0]}{" "}
                                </div>
                              )}
                            </div>

                            <div className="col-md-6">
                              <label
                                className="form-label"
                              >
                                Phone
                              </label>
                              <input
                                type="text"
                                value={phone_number}
                                className="form-control"
                                onChange={handlePhoneChange}
                              />

                              {errors.phone_number && (
                                <div className="error" style={{ color: "red" }}>
                                  {errors.phone_number[0]}{" "}
                                </div>
                              )}
                            </div>

                            <div className="col-6 d-none">
                              <label
                                className="form-label"
                              >
                                Invite Code
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={inviteCode}
                                disabled
                                readOnly
                                onChange={handleInviteCodeChange}
                              />
                              {errors.inviteCode && (
                                <div className="error" style={{ color: "red" }}>
                                  {errors.inviteCode[0]}{" "}
                                </div>
                              )}
                            </div>
                            <div className="col-12">
                              <label
                                className="form-label"
                              >
                                WhatsApp
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={whtsapp}
                                placeholder=""
                                onChange={handleWhatsAppChange}
                              />
                              {errors.whtsapp && (
                                <div className="error" style={{ color: "red" }}>
                                  {errors.whtsapp[0]}{" "}
                                </div>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">
                                Country
                              </label>
                              <select
                                id="inputState"
                                className="form-select"
                                value={nationality_id}
                                onChange={handleChange}
                              >
                                <option value="">Choose...</option>
                                {countrys.map((country) => (
                                  <option key={country.id} value={country.name}>
                                    {country.name}
                                  </option>
                                ))}{" "}
                                {countrys.map((country) => (
                                  <option key={country.id} value={country.name}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>

                              {errors.nationality_id && (
                                <div className="error" style={{ color: "red" }}>
                                  {errors.nationality_id[0]}{" "}
                                </div>
                              )}
                            </div>

                            <div className="col-md-6">
                              <label className="form-label">
                                Upload Your Picture
                              </label>
                              <input
                                className="form-control"
                                type="file"
                                id="formFile"
                                onChange={handlePicChange}
                              />
                            </div>

                            <div className="row mt-4 mb-2">
                              <div className="col-md-12">
                                <center>
                                  {image ? (
                                    <center>
                                      <img
                                        src={image}
                                        alt="Description"
                                        className="img-thumbnail"
                                      />
                                    </center>
                                  ) : null}

                                  {errors.file && (
                                    <div
                                      className="error"
                                      style={{ color: "red" }}
                                    >
                                      {errors.file[0]}{" "}
                                    </div>
                                  )}
                                </center>
                              </div>
                            </div>

                            <div className="col-12 mb-5">
                              <div className="text-center">
                                <button
                                  type="submit"
                                  className="btn btn_primary w-100"
                                >
                                  <span>
                                    <small>Submit</small>
                                   
                                  </span>
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </section>
                    )}
                    
                  </div>
                </div>
               
                <div className="col-md-6">
                  <div className="profile_card">
                    <div className="card_header">
                      <h4>Email</h4>
                      
                    </div>
                    <div className="profile_info">
                      <p>
                        <strong>Current Email:</strong> {email}
                      </p>
                    </div>
                    <form action="sss" className="change_form email_change">
                      <div className="form-group mb-2">
                        <label>
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Email"
                          className="form-control"
                        />
                      </div>
                      <button type="submit" className="btn_confirm">
                        Change
                      </button>
                    </form>
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

export default Profile;
