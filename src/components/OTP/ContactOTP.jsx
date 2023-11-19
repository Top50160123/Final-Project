import React, { useState, useEffect, useContext } from "react";
import emailjs from "emailjs-com";
import { DataContext } from "../../context/OTContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../firebase";

export const ContactUs = () => {
  const { data, setData } = useContext(DataContext);
  const [formData, setFormData] = useState({
    to: "",
    message: "",
  });
  const [otp, setOTP] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canSendOTP, setCanSendOTP] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    emailjs.init("Fv36D-8cb5ZkJGSL7");
  }, []);

  useEffect(() => {
    let timer;

    if (countdown > 0 && !canSendOTP) {
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else {
      setCanSendOTP(true);
      setCountdown(30);
    }

    return () => clearTimeout(timer);
  }, [countdown, canSendOTP]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "to") {
      setData((prevData) => ({
        ...prevData,
        email: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const generateRandomNumber = () => {
    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOTP(randomOTP.toString());
    return randomOTP;
  };

  const sendMail = () => {
    const { to } = formData;

    const params = {
      to: data.email,
      message: generateRandomNumber().toString(),
    };

    const serviceID = "service_brpgbhh";
    const templateID = "template_ye5ftka";

    emailjs
      .send(serviceID, templateID, params)
      .then((res) => {
        alert("Email sent successfully!!");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });

    setCanSendOTP(false);
  };

  const validateOTP = (e) => {
    e.preventDefault();
    const enteredOTP = otp;

    if (enteredOTP === generatedOTP) {
      alert("OTP Correct");
      updateUser(data);
      navigate("/login");
    } else {
      alert("OTP Incorrect");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMail();
  };

  return (
    <div>
      <h1>Send Email</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="text"
          id="to"
          value={data.email}
          onChange={handleInputChange}
          disabled
        />
        <br />
        <button type="submit" disabled={!canSendOTP}>
          Send OTP {canSendOTP ? "" : `(${countdown}s)`}
        </button>
      </form>
      <br />
      <form onSubmit={validateOTP}>
        <label>Enter OTP</label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
        />
        <button type="submit">Validate OTP</button>
      </form>
      <div>
        <Link to="/register">Back to the registration page </Link>
      </div>
    </div>
  );
};
