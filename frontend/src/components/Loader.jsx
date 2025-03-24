import React from 'react';
import '../assets/Loading.css';

const Loader = () => {
  return (
    <div className="loader-container">
    <div className="loader"></div>
    <div className="loader-text">Processing...</div>
  </div>
  
  );
};

export default Loader;
