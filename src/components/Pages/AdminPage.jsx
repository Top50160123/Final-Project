import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import { getSignedDocument, getUrl } from "../../firebase";
import { Button, Card, Col, Divider, Row } from "antd";

function AdminPage() {
  const { logOut, user } = useUserAuth();
  const [signedDocuments, setSignedDocuments] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const fetchSignedDocuments = async () => {
      try {
        const documents = await getSignedDocument();
        setSignedDocuments(documents);
      } catch (error) {
        console.error("Error fetching signed documents:", error);
      }
    };

    fetchSignedDocuments();
  }, []);

  const handleDetail = (fileName, user) => {
    navigate("/Detail", { state: { fileName, user } });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documentUrl = await getAllSignData(user.email);
        console.log("documentUrl", documentUrl);
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* <div>
        <h2>Audit log page</h2>
        <p>{user?.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div>
        <Link to="/CreateDocuments" state={{ userId: user?.uid }}>
          Create Document
        </Link>
      </div>
      <div>
        <Link to="/Audit">Audit Log</Link>
      </div>
      <div>
        <h3>Signed Documents:</h3>
        <ul>
          {signedDocuments.map((document) => (
            <li key={document.id}>
              <strong>Email:</strong> {document.email}
              <br />
              {Object.keys(document.files).map((fileName, index) => (
                <div key={index}>
                  <strong>File {index + 1}:</strong>
                  <br />
                  <strong>URL:</strong> {document.files[fileName].Url[0]}
                  <br />
                  <strong>Type:</strong> {document.files[fileName].type}
                  <br />
                  <strong>Date:</strong>
                  {document.files[fileName].timestamp.toDate().toLocaleString()}
                  <br />
                  <strong>Status:</strong>
                  <br />
                  <button
                    onClick={() =>
                      handleDetail(document.files[fileName], document.email)
                    }
                  >
                    Go to Details
                  </button>
                </div>
              ))}
            </li>
          ))}
        </ul>
      </div> */}
      <Row justify={"center"}>
        <Col
          style={{
            fontSize: "20px",
          }}
        >
          Document Request
        </Col>
      </Row>
      <Row justify={"center"}>
        <Card
          style={{
            textAlign: "justify",
            width: "1023px",
          }}
        >
          <Row>
            {signedDocuments.map((document) => (
              <Col
                span={24}
                style={{
                  marginBottom: "10px",
                }}
                key={document.id}
              >
                <Row>
                  <Col>Email: {document.email}</Col>
                </Row>

                {Object.keys(document.files).map((fileName, index) => (
                  <div key={index}>
                    <Row>File {index + 1}:</Row>

                    <Row
                      style={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      <Col>Url :</Col>
                      <Col>
                        {" "}
                        <a
                          href={document.files[fileName].Url[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {document.files[fileName].Url[0]}
                        </a>
                      </Col>
                    </Row>

                    <Row>Type: {document.files[fileName].type}</Row>

                    <Row justify={"center"}>
                      Date:{" "}
                      {document.files[fileName].timestamp
                        .toDate()
                        .toLocaleString()}
                    </Row>
                    <Row justify={"center"}>
                      <Button
                        onClick={() =>
                          handleDetail(document.files[fileName], document.email)
                        }
                      >
                        Document Detail
                      </Button>
                    </Row>
                  </div>
                ))}
                <Divider />
              </Col>
            ))}
          </Row>
        </Card>
      </Row>
      <Row
        justify={"center"}
        style={{
          marginTop: "20px",
        }}
      >
        <Col span={24}>Audit Log</Col>
        <Col span={24}>
          <Link to="/CreateDocuments" state={{ userId: user?.uid }}>
            Create Document
          </Link>
        </Col>
        <Col span={24}>
          <Link to="/Audit">Audit Log</Link>
        </Col>
      </Row>
    </div>
  );
}

export default AdminPage;
