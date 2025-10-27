import React, { useContext } from "react";
import { Navigate } from "react-router";
import { AppContext } from "../context/AppContext.jsx";


const AuthRoute = ({ children, protect = false }) => {
  const { user } = useContext(AppContext);

  //Protected Route: must be logged in
  if (protect && !user) {
    return <Navigate to="/login" replace />;
  }

  //Public Route: must be logged out
  if (!protect && user) {
    return <Navigate to="/" replace />;
  }

  //Allowed route
  return children;
};

export default AuthRoute;
