import React, { useState, useEffect } from "react";
import axios from "/config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

const EditBrand = () => {
  const { id } = useParams();

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await axios.get(`/brands/brandrow/${id}`);
        setBrandData(response.data.data);
        setBrandName(response.data.data.name);
        //setStatus(response.data.data.status);
        setStatus(response.data.data.status.toString());
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };
    fetchBrandData();
  }, [id]);

  const [brandData, setBrandData] = useState(null);
  const navigate = useNavigate();
  const [name, setBrandName] = useState("");

  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const handleBrandNameChange = (e) => {
    setBrandName(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/brands/save", {
        name,
        status,
        id,
      });
      console.log(response.data.message);
      navigate("/brand-list");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation errors:", error.response.data.errors);
        setErrors(error.response.data.errors);
      } else {
        console.error("Error adding brand:", error);
      }
    }
  };

  const backtoBrandlist = () => {
    navigate("/brand-list");
  };

  return (
    <div>
      <Helmet>
        <title>Edit Brand</title>
      </Helmet>
      <div className="container">
        <br />
        <div className="row">
          <div className="col-9">
            <h2>Edit Brand</h2>
          </div>
          <div className="col-2">
            <button className="btn btn-primary" onClick={backtoBrandlist}>
              Back to Brand List
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="brandName">Brand Name:</label>
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
         

          <div>
            <label htmlFor="description">Status:</label>
            <select
              className="form-control"
              id="status"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
            {errors.status && (
              <div className="error" style={{ color: "red" }}>
                {errors.status[0]}
              </div>
            )}
          </div>

          <div>
            <br />
            <button type="submit" className="btn btn-primary w-100">
              Add Brand
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBrand;