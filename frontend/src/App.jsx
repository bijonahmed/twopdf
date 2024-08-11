// src/App.js
import React from "react";
import { Link } from "react-router-dom";
import AppRouter from "./rotuer";
import Guest from '../components/GuestNavbar';
import Auth from '../components/AuthNavbar';
import AuthUser from "./components/AuthUser";

function App() {
  const { getToken } = AuthUser();
  
  return (
    <div>
      {/* {getToken() ? <Auth /> : <Guest />} */}
      <AppRouter />
    </div>
  );
}

export default App;
