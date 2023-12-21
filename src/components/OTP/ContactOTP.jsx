import React, { useState, useEffect, useContext } from "react";
import emailjs from "emailjs-com";
import { DataContext } from "../../context/OTContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../firebase";
import { Button, Card, Col, Input, Row, Typography } from "antd";

const { Title, Text } = Typography;

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
      <style>
        {`
          body {
            background-color: rgba(98, 38, 157, 0.7);
          }
        `}
      </style>

      <Row gutter={[8, 8]} justify={"center"}>
        <Card
          style={{
            width: "1023px",
            height: "700px",
            marginTop: "100px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Row gutter={[8, 16]} justify={"center"}>
              <Col
                span={24}
                style={{
                  marginTop: "100px",
                }}
              >
                <Title
                  level={2}
                  style={{
                    color: "var(--primary-500, #0277BD)",
                    fontSize: "40px",
                    fontWeight: "600",
                  }}
                >
                  OTP
                </Title>
              </Col>
              <Col st span={24}>
                <Text
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    textAlign: "center",
                    color: "#197AA4",
                  }}
                >
                  For security reasons, we will send a One Time Password (OTP)
                  to your email as shown below.
                </Text>
              </Col>
              <Row gutter={[8, 16]} justify={"space-between"}>
                <Col xl={{ span: 13 }} xs={{ span: 24 }}>
                  <Input
                    type="text"
                    id="to"
                    value={data.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    disabled
                    style={{
                      backgroundColor: "#D9D9D9",
                      width: "423px",
                      height: "60px",
                      borderRadius: "20px",
                      fontSize: "24px",
                      fontWeight: "600",
                      lineHeight: "normal",
                    }}
                  />
                </Col>

                <Col xl={{ span: 6 }} xs={{ span: 24, marginTop: 2 }}>
                  <Button
                    htmlType="submit"
                    disabled={!canSendOTP}
                    style={{
                      width: "171px",
                      height: "60px",
                      backgroundColor: "#D9D9D9",
                      borderRadius: "20px",
                      fontSize: "20px",
                      color: "#8F8F8F",
                    }}
                  >
                    Send OTP {canSendOTP ? "" : `(${countdown}s)`}
                  </Button>
                </Col>
              </Row>
            </Row>
          </form>
          <form onSubmit={validateOTP}>
            <Row
              gutter={[8, 16]}
              justify={"center"}
              style={{
                marginTop: "10px",
              }}
            >
              <Col span={24}>
                <Text
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    textAlign: "center",
                    color: "#197AA4",
                  }}
                >
                  Enter your OTP to Sign Up
                </Text>
              </Col>
              <Col span={24}>
                <Input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  placeholder="Enter Your OTP"
                  style={{
                    backgroundColor: "#D9D9D9",
                    width: "423px",
                    height: "60px",
                    borderRadius: "20px",
                    fontSize: "24px",
                    fontWeight: "600",
                    lineHeight: "normal",
                  }}
                />
              </Col>
              <Col span={24}>
                <Button
                  htmlType="submit"
                  style={{
                    backgroundColor: "#14B538",
                    color: "white",
                    width: "305px",
                    height: "45px",
                    borderRadius: "20px",
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                >
                  Confirm
                </Button>
              </Col>
              <Col span={24}>
                <Link
                  to="/register"
                  style={{ textDecorationLine: "underline" }}
                >
                  <Text
                    style={{
                      color: "#197AA4",
                      fontSize: "20px",
                    }}
                  >
                    Back to the registration page
                  </Text>
                </Link>
              </Col>
            </Row>
          </form>
        </Card>
      </Row>
    </div>
  );
};
