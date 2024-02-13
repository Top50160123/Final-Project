import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { userCmu } from "./callback";
console.log(userCmu);
function ProtectedRoute({ children }) {
  const { user } = useUserAuth();

  if (!user) {
    return <Navigate to="/" />;
  }
  if (!userCmu) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
