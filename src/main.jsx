import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./components/Login/Login.jsx"; // login page
import Register from "./components/Register/Register.jsx"; // register page
import UserPage from "./components/Pages/UserPage.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx"; // protect
import { ContactUs } from "./components/OTP/ContactOTP.jsx"; // otp
import { DataContextProvider } from "./context/OTContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminPage from "./components/Pages/AdminPage.jsx"; // admin page
import CreatePDF from "./components/Pages/CreatePDF.jsx"; // admin create pdf
import AuditPDF from "./components/Pages/auditPDF.jsx";
import DocumentDetail from "./components/Pages/EditPage.jsx";
import "./index.css";
import { UserAuthContextProvider } from "./context/UserAuthContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Callback from "./auth/callback.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/DocumentDownload",
    element: (
      // <ProtectedRoute>
        <UserPage />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/contactUsOtp",
    element: <ContactUs />,
  },
  {
    path: "/Documents",
    element: (
      // <ProtectedRoute>
        <AdminPage />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/CreateDocuments",
    element: (
      <ProtectedRoute>
        <CreatePDF />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Audit",
    element: <AuditPDF />,
  },
  {
    path: "/Detail",
    element: <DocumentDetail />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <DataContextProvider>
        <RouterProvider router={router} />
      </DataContextProvider>
    </UserAuthContextProvider>
  </React.StrictMode>
);
