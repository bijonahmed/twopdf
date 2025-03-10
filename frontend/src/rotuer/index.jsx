// src/Router.js
import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "../pages/Index.jsx";
import Faq from "../pages/faq.jsx";
import About from "../pages/About";
import Contact from "../pages/Contact";
import BrandList from "../pages/brand/brand-list";
import AddBrand from "../pages/brand/add-brand";
import Editbrand from "../pages/brand/edit-brand";
import Register from "../pages/Register";
import Login from "../pages/Login";
import UserLogin from "../pages/UserLogin.jsx";
import Dashboard from "../pages/Dashboard";
import CategorySlug from "../pages/Category";
import CategoryAll from "../pages/CategoryAll";

import Premimum from "../pages/packages/premimum";
import Whyw3programmer from "../pages/Whyw3programmer.jsx";
import Signup from "../pages/Signup.jsx";
import Pdfbooks from "../pages/PdfBooks.jsx";
import UserProfile from "../pages/users/Profile.jsx";
import ChangePassword from "../pages/users/ChangePassword.jsx";
import MyCertificate from "../pages/users/Certificate.jsx";
import Referral from "../pages/users/Referral.jsx";
import Bookmarks from "../pages/users/Bookmarks.jsx";
import Margepdf from "../pages/pdf/margepdf.jsx";
import Spiltpdf from "../pages/pdf/splitpdf.jsx";
import Pdftotxt from "../pages/pdf/pdftotxt.jsx";
import Pdftoppt from "../pages/pdf/pdftoppt.jsx";
import Pdfzip from "../pages/pdf/pdfzip.jsx";
import ImagetoPDF from "../pages/pdf/imgtopdf.jsx";
import Protectpdf from "../pages/pdf/protectpdf.jsx";
import Watermarkpdf from "../pages/pdf/watermarkpdf.jsx";

import Pricing from "../pages/Pricing.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";
import TermsAndConditions from "../pages/TermsAndConditions.jsx";

import NotFound from '../pages/NotFound';


//import ProtectedRoute from "../components/ProtectedRoute";
//<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
const AppRouter = () => {
  return (
    <Routes>
       <Route path="/" element={<Index />} />
      {/* <Route path="/home" element={<Home />} /> */}
      <Route path="/edit-brand/:id" element={<Editbrand />} />
      <Route path="/brand-list" element={<BrandList />} />
      <Route path="/add-brand" element={<AddBrand />} />
     
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
       <Route path="/user-login" element={<UserLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/category/:slug" element={<CategorySlug />} />
      <Route path="/all-category" element={<CategoryAll />} />
      {/* <Route path="/study" element={<Study />} /> */}

      <Route path="/whyw3programmer" element={<Whyw3programmer />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pdf-books" element={<Pdfbooks />} />
    
      
      {/* //add new */}
      <Route path="/premimum-packages" element={<Premimum />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/pdf/margepdf" element={<Margepdf />} />
      <Route path="/pdf/splitpdf" element={<Spiltpdf />} />
      <Route path="/pdf/pdftotxt" element={<Pdftotxt />} />
      <Route path="/pdf/pdftoppt" element={<Pdftoppt />} />
      <Route path="/pdf/pdfzip" element={<Pdfzip />} />
      <Route path="/pdf/imgtopdf" element={<ImagetoPDF />} />
      <Route path="/pdf/protectpdf" element={<Protectpdf />} />
      <Route path="/pdf/watermarkpdf" element={<Watermarkpdf />} />
      <Route path="/users/profile" element={<UserProfile />} />
      <Route path="/users/change-password" element={<ChangePassword />} />
      <Route path="/users/my-certificate" element={<MyCertificate />} />
      <Route path="/users/referral" element={<Referral />} />
      <Route path="/users/my-bookmarks" element={<Bookmarks />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
