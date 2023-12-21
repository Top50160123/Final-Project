import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { UrlSign, deleteUrl } from "../../firebase";

function DocumentDetail() {
  const { state } = useLocation();
  const [secretKey, setSecretKey] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [enteredOTP, setEnteredOTP] = useState("");
  const [enteredOTPp, setEnteredOTPp] = useState("");
  const [verificationResultt, setVerificationResultt] = useState("");
  const [generatedSecret, setGeneratedSecret] = useState("");
  const [open, setOpen] = useState(false);

  if (!state || !state.document) {
    return (
      <div>
        <h2>Document Details</h2>
        <p>Error: Document details not found.</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchSecretKey = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5003/api/get-secret-key"
        );
        setSecretKey(response.data.secretKey);
      } catch (error) {
        console.error("Error fetching secret key:", error);
      }
    };
    fetchSecretKey();
  }, []);

  const showOtp = () => {
    generateOTPAndQRCode();
  };

  const handleSign = async () => {
    try {
      const response = await fetch("http://localhost:5003/api/sign-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secretKey}`,
        },
        body: JSON.stringify({
          fileName: state.document.id,
          downloadLink: state.document.url,
          content: state.document.content,
          token: secretKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("result :", result);
      if (result.success) {
        await UrlSign(state.document.uid, state.document.id, result.fileUrl);
        console.log("Sign Correct :", result.fileUrl);
      } else {
        console.error("Wrong to Sign ", result.error || "Wrong to Sign");
      }
    } catch (error) {
      console.error("Wrong to Sign", error.message || "Wrong to Sign");
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch("http://localhost:5003/api/reject-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secretKey}`,
        },
        body: JSON.stringify({
          fileName: state.document.id,
        }),
      });
      const result = await response.json();
      console.log("result :", result);
      await UrlSign(state.document.uid, result.message);
    } catch (error) {
      console.error("Wrong to Sign", error.message || "Wrong to Sign");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUrl(state.document.uid);
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const generateOTPAndQRCode = async () => {
    try {
      const serverURL = "http://localhost:5003/api/generate-otp-and-qrcode";
      const response = await axios.post(serverURL);

      const { secret, otpauth_url, qrcode } = response.data;
      setGeneratedSecret(secret);
      setGeneratedOTP(secret);
      setEnteredOTP(qrcode);
      // setShowQrCode(!false);
    } catch (error) {
      console.error("Error generating OTP and QR code:", error);
    }
  };

  useEffect(() => {
    generateOTPAndQRCode();
  }, []);

  const handleOTPVerification = async () => {
    try {
      const serverURL = "http://localhost:5003/api/verify-otp";
      const response = await axios.post(serverURL, {
        otp: enteredOTPp,
        secret: generatedSecret,
      });

      setVerificationResultt(response.data.message);
      handleSign();
    } catch (error) {
      console.error("Error verifying OTP:", error);

      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }

      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "Invalid OTP"
      ) {
        console.error("Invalid OTP entered.");
      } else {
      }
    }
  };

  return (
    <div>
      <div>
        <div>Test authentication with Google</div>
      </div>
      <h2>Document Details</h2>
      <p>
        <strong>Email:</strong> {state.document.email}
        <br />
        <strong>URL:</strong> {state.document.url}
        <br />
        <strong>Type:</strong> {state.document.type}
        <br />
        <strong>content:</strong> {state.document.content}
        <br />
        <strong>Date:</strong>
        {state.document.timestamp
          ? new Date(state.document.timestamp).toLocaleString()
          : "N/A"}
        <br />
        <strong>Status:</strong> {state.document.action}
      </p>
      {open && (
        <div>
          <h1>OTP Example</h1>
          <p>Generated OTP: {generatedOTP}</p>
          <img src={enteredOTP} alt="QR Code" />

          <h1>OTP Verification</h1>
          <label>Enter OTP:</label>
          <input
            type="text"
            value={enteredOTPp}
            onChange={(e) => setEnteredOTPp(e.target.value)}
          />
          <button onClick={handleOTPVerification}>Verify OTP</button>

          {verificationResultt && <p>{verificationResultt}</p>}
        </div>
      )}
      <button onClick={() => setOpen(!open)}>
        {open ? "Close Modal" : "Sign"}
      </button>
      <div>
        <button onClick={handleReject}>reject</button>
      </div>
      <div>
        <button onClick={handleDelete}>delete</button>
      </div>
      <Link to="/Documents">Back to List</Link>
    </div>
  );
}

export default DocumentDetail;
