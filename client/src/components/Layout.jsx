import React from "react";
import Navbar from "./Navbar.jsx";
import { Outlet } from "react-router";
import Footer from "./Footer.jsx";

const Layout = () => {
  return (
    <>
      <Navbar />

      <Outlet />

      <Footer />
    </>
  );
};

export default Layout;  
