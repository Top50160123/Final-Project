import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDocuments } from "../../firebase";

const AuditPDF = () => {
  const [documents, setDocuments] = useState([]);

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

  return (
    <div>
      <h1>Audit Document</h1>
      <Link to="/Documents">Back to List</Link>

      <div>
        <h2>Document List:</h2>
        <ul>
          {documents.map((d) => (
            <div key={d.id}>
              <p>FileName: {d.data.fileName}</p>
              <p>Admin: {d.data.admin}</p>
              <p>
                Timestamp:
                {new Date(d.data.timestamp.seconds * 1000).toLocaleString()}
              </p>
              <p>Action: {d.data.action}</p>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuditPDF;
