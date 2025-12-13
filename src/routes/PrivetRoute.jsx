import React from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../Components/Loading/Loading";
import { Navigate, useLocation } from "react-router";

const PrivetRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <Loading></Loading>;
  }
  if (!user && user?.email) {
    return <Navigate to="/auth/login" state={{ from: location }} replace></Navigate>;
  }
  return children;
};

export default PrivetRoute;
