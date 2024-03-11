import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  deleteRelatedDocumentsByUrl,
  deleteDocumentsByUrl,
  UrlSign,
  addAction,
} from "../../firebase";
import { Button, Card, Col, Row, Typography } from "antd";
const { Title, Text } = Typography;

const DocumentDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileName, user, cmuId } = location.state;

  const timestampDate = new Date(
    fileName.timestamp.seconds * 1000 + fileName.timestamp.nanoseconds / 1000000
  );

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [openQr, setOpenQr] = useState(false);
  const [qr, setQr] = useState("");
  const [qRCheck, setQRCheck] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleDelete = async (fileName, url) => {
    try {
      await deleteRelatedDocumentsByUrl(url);
      await deleteDocumentsByUrl(url);
      await addAction("admin", "edit", fileName, url);
      const response = await fetch(
        `https://server-node-tau.vercel.app/api/delete-pdf/${fileName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete PDF");
      }

      const data = await response.json();
      if (data) {
        navigate("/CreateDocuments");
      }
    } catch (error) {
      console.error("Delete fail:", error);
    }
  };

  const handleDeletes = async (fileName, url) => {
    try {
      await deleteRelatedDocumentsByUrl(url);
      await deleteDocumentsByUrl(url);
      await addAction("admin", "delete", fileName, url);
      const response = await fetch(
        `https://server-node-tau.vercel.app/api/delete-pdf/${fileName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete PDF");
      }

      const data = await response.json();
      if (data) {
        navigate("/Documents");
      }
    } catch (error) {
      console.error("Delete fail:", error);
    }
  };

  const rejectPDF = async ({ user, fileName, date, url, action }) => {
    try {
      await addAction("admin", action, fileName.type, url);
      await UrlSign(user, fileName.type, date, url, action);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmQr = async ({ user, fileName, date, url, action }) => {
    try {
      const response = await fetch(
        `https://server-node-tau.vercel.app/api/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: qr,
            secret: secretKey,
            token: qRCheck,
          }),
        }
      );
      const data = await response.json();
      if (data.valid === true) {
        alert("Sign success");
        rejectPDF({
          user: user,
          fileName: fileName,
          date: date,
          url: url,
          action: action,
        });
      } else {
        alert("Fail...");
      }
    } catch (error) {
      console.error("Error confirming QR:", error);
    }
  };

  const fetchSecretKey = async () => {
    try {
      const response = await fetch(
        `https://server-node-tau.vercel.app/api/get-secret-key`
      );
      const data = await response.json();
      const secretKey = data.secretKey;
      setSecretKey(secretKey);
    } catch (error) {
      console.error("Error fetching secret key:", error);
    }
  };

  useEffect(() => {
    fetchSecretKey();
  }, []);

  useEffect(() => {
    const fetchQrCodeUrl = async () => {
      try {
        const response = await fetch(
          `https://server-node-tau.vercel.app/api/generate-otp-and-qrcode`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setQrCodeUrl(data.qrcode);
        setQRCheck(data.token);
      } catch (error) {
        console.error("Error fetching QR code URL:", error);
      }
    };

    fetchQrCodeUrl();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenQr(false);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div>
        {/* <h1>Detail Page</h1>
        <p>User: {user}</p>
        <p>Type: {fileName.type}</p>
        <p>Date: {timestampDate.toLocaleString()}</p>
         <a href={fileName.Url[0]}>asdasd</a> 
        <button
          onClick={() =>
            rejectPDF({
              user: user,
              fileName: fileName,
              date: timestampDate.toLocaleString(),
              url: fileName.Url[0],
              action: "reject",
            })
          }
        >
          Reject
        </button>
        <button
          onClick={() =>
            handleConfirmQr({
              user: user,
              fileName: fileName,
              date: timestampDate.toLocaleString(),
              url: fileName.Url[0],
              action: "sign",
            })
          }
          // onClick={() => {
          //   setOpenQr(true);
          // }}
        >
          Sign
        </button>
        {openQr ? (
          <>
            {qrCodeUrl && <img src={qrCodeUrl} />}
            <input value={qr} onChange={(e) => setQr(e.target.value)} />
            <button
              onClick={() =>
                handleConfirmQr({
                  user: user,
                  fileName: fileName,
                  date: timestampDate.toLocaleString(),
                  url: fileName.Url[0],
                  action: "sign",
                })
              }
            >
              Confirm to sign
            </button>
          </>
        ) : null}
        <button onClick={() => handleDelete(fileName.type, fileName.Url[0])}>
          Edit
        </button>
        {cmuId === "630615045" ? (
          <>
            <button
              onClick={() => handleDeletes(fileName.type, fileName.Url[0])}
              disabled
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleDeletes(fileName.type, fileName.Url[0])}
            >
              Delete
            </button>
          </>
        )} */}
      </div>
      <Link to="/Documents">Back to List</Link>

      <div>
        <Row justify={"center"}>
          <Col span={24}>
            <Card>
              <Row>
                <Col span={24}>
                  <Title
                    level={3}
                    style={{
                      color: "#000",
                      textAlign: "center",
                    }}
                  >
                    Document Detail Page
                  </Title>
                </Col>
                <Col
                  span={24}
                  style={{
                    marginTop: "10px",
                  }}
                >
                  User : {user}
                </Col>
                <Col
                  span={24}
                  style={{
                    marginTop: "10px",
                  }}
                >
                  Type : {fileName.type}
                </Col>
                <Col
                  span={24}
                  style={{
                    marginTop: "10px",
                  }}
                >
                  Date: {timestampDate.toLocaleString()}
                </Col>
                <Col
                  span={24}
                  style={{
                    marginTop: "10px",
                  }}
                >
                  <Button
                    style={{
                      marginRight: "10px",
                    }}
                    onClick={() =>
                      rejectPDF({
                        user: user,
                        fileName: fileName,
                        date: timestampDate.toLocaleString(),
                        url: fileName.Url[0],
                        action: "reject",
                      })
                    }
                  >
                    Reject
                  </Button>
                  <Button
                    style={{
                      marginRight: "10px",
                    }}
                    onClick={() => {
                      setOpenQr(true);
                    }}
                  >
                    Sign
                  </Button>
                  {openQr ? (
                    <>
                      {qrCodeUrl && <img src={qrCodeUrl} />}
                      <input
                        value={qr}
                        onChange={(e) => setQr(e.target.value)}
                      />
                      <Button
                        style={{
                          marginRight: "10px",
                        }}
                        onClick={() =>
                          handleConfirmQr({
                            user: user,
                            fileName: fileName,
                            date: timestampDate.toLocaleString(),
                            url: fileName.Url[0],
                            action: "sign",
                          })
                        }
                      >
                        Confirm to sign
                      </Button>
                    </>
                  ) : null}
                  <Button
                    style={{
                      marginRight: "10px",
                    }}
                    onClick={() => handleDelete(fileName.type, fileName.Url[0])}
                  >
                    Edit
                  </Button>
                  {cmuId === "630615045" ? (
                    <>
                      <Button
                        style={{
                          marginRight: "10px",
                        }}
                        onClick={() =>
                          handleDeletes(fileName.type, fileName.Url[0])
                        }
                        disabled
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        style={{
                          marginRight: "10px",
                        }}
                        onClick={() =>
                          handleDeletes(fileName.type, fileName.Url[0])
                        }
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DocumentDetail;
