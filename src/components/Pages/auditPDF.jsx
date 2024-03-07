import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDocuments } from "../../firebase";
import { Row, Table } from "antd";

const AuditPDF = () => {
  const [documents, setDocuments] = useState([]);

  const columns = [
    {
      title: "File Name",
      dataIndex: "fileName",
    },
    {
      title: "Admin",
      dataIndex: "admin",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documentsData = await getDocuments();
        setDocuments(documentsData);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchDocuments();
  }, []);

  console.log("documents", documents);

  return (
    <div>
      <h1>Audit Document</h1>
      <Link to="/Documents">Back to List</Link>

      <div>
        <h2>Document List:</h2>
        <ul>
          {documents &&
            documents.map((d) => (
              <div key={d.id}>
                {d.data && (
                  <>
                    <p>FileName: {d.data.fileName}</p>
                    <p>Admin: {d.data.admin}</p>
                    <p>Timestamp: {d.data.timestamp.toDate().toLocaleString()}</p>
                    <p>Action: {d.data.action}</p>
                  </>
                )}
              </div>
            ))}
        </ul>
      </div>
      {/* <div>
        <Row justify={"center"}>
          <Table
            dataSource={documents.map((document) => ({
              key: document.id,
              fileName: document.data.fileName,
              admin: document.data.admin,
              timestamp: new Date(
                document.data.timestamp.seconds * 1000
              ).toLocaleString(),
              action: document.data.action,
            }))}
            columns={columns}
          />
        </Row>
      </div> */}
    </div>
  );
};

export default AuditPDF;
