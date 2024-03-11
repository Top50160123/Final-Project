import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import {
  getCreatedDocuments,
  SignDoc,
  getUrl,
  addAction,
  deleteUserByEmail,
} from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { Button, Col, Row, Select, Table } from "antd";

function UserPage() {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pdfData, setPdfData] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [urlSign, setUrlSign] = useState("");
  const [urlSignEmail, setUrlSignEmail] = useState("");
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (location.state) {
          const documentUrl = await getUrl(location.state.email);
          setUrlSign(documentUrl);
        } else {
          const documentUrl = await getUrl(user?.email);
          setUrlSignEmail(documentUrl);
        }
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      }
    };

    fetchData();
  }, [user?.email]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documents = await getCreatedDocuments();
        setPdfData(documents);
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSignDocument = async () => {
    if (selectedType) {
      try {
        const CMUUid = uuidv4();
        if (location.state) {
          await SignDoc(
            location.state.email,
            selectedType,
            pdfData.find((doc) => doc.data.fileName === selectedType)?.data.url
          );
          await addAction(
            location.state.email,
            "request",
            selectedType,
            pdfData.find((doc) => doc.data.fileName === selectedType)?.data.url
          );
        } else {
          await SignDoc(
            user?.email,
            selectedType,
            pdfData.find((doc) => doc.data.fileName === selectedType)?.data.url
          );
          await addAction(
            user?.email,
            "request",
            selectedType,
            pdfData.find((doc) => doc.data.fileName === selectedType)?.data.url
          );
        }
      } catch (error) {
        console.error("Error signing document:", error);
      }
    }
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text) =>
        text === "reject" ? "ไม่อนุญาตให้ download" : "อนุญาตให้ Download",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Download",
      dataIndex: "download",
      key: "download",
      render: (text, record) => (
        <a href={record.url} target="_blank" rel="noopener noreferrer">
          Download
        </a>
      ),
    },
  ];

  const data = urlSignEmail.files
    ? Object.keys(urlSignEmail.files).map((key) => ({
        key,
        fileName: urlSignEmail.files[key].fileName,
        action: urlSignEmail.files[key].action,
        date: urlSignEmail.files[key].date,
        url: urlSignEmail.files[key].url,
      }))
    : [];

  const data2 = urlSign.files
    ? Object.keys(urlSign.files).map((key) => ({
        key,
        fileName: urlSign.files[key].fileName,
        action: urlSign.files[key].action,
        date: urlSign.files[key].date,
        url: urlSign.files[key].url,
      }))
    : [];

  return (
    <div>
      <h2>Welcome</h2>
      {location.state ? (
        <div>
          <div>Name: {location.state.name}</div>
          <div>Last Name: {location.state.lastName}</div>
          <div>Student ID: {location.state.studentId}</div>
        </div>
      ) : (
        <div>{user?.email}</div>
      )}
      <Button onClick={handleLogout} variant="danger">
        LOGOUT
      </Button>
      <div>
        <h3>Document Request</h3>
        <Row
          justify={"center"}
          style={{
            marginBottom: "10px",
          }}
        >
          <Col
            style={{
              marginRight: "10px",
            }}
          >
            Select Type :{" "}
          </Col>
          <Select
            value={selectedType}
            onChange={(value) => {
              setSelectedType(value);
            }}
          >
            <Select.Option value="">Select Type</Select.Option>
            {pdfData.map((d) => (
              <Select.Option key={d.id} value={d.data.fileName}>
                {d.data.fileName}
              </Select.Option>
            ))}
          </Select>
          {selectedType && (
            <Col
              span={24}
              style={{
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              <Button onClick={handleSignDocument}>Request Document</Button>
            </Col>
          )}
        </Row>

        {location.state ? (
          <>
            <div>
              <Table columns={columns} dataSource={data2} />
            </div>
          </>
        ) : (
          <>
            <div>
              <Table columns={columns} dataSource={data} />
            </div>
          </>
        )}

        <div>
          <Row justify={"center"}></Row>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
