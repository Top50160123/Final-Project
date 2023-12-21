import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import { getDocuments } from "../../firebase"; // Assuming you have a function getDocuments

const AuditPDF = () => {
  const [documents, setDocuments] = useState([]);
  const { user } = useUserAuth();

  useEffect(() => {
    const uid = user?.uid || "";
    let unsubscribe; // Declare the variable here

    if (uid) {
      unsubscribe = getDocuments(uid) // Replace getList with getDocuments
        .then((documents) => {
          setDocuments(documents);
        })
        .catch((error) => {
          console.error("Error fetching documents:", error);
        });
    }

    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [user]);

  return (
    <div>
      <h1>Audit Document</h1>
      <Link to="/Documents">Back to List</Link>

      <div>
        <h2>Document List:</h2>
        <ul>
          {documents.map((document) => (
            <li key={document.id}>
              <p>Document ID: {document.id}</p>
              <p>Action: {document.action}</p>
              <p>Type: {document.type}</p>
              <p>FileName: {document.fileName}</p>
              <p>Content: {document.content}</p>
              <p>URL: {document.url}</p>
              <p>
                Timestamp:{" "}
                {document.timestamp && document.timestamp.toDate().toString()}
              </p>
              {/* Add other properties as needed */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuditPDF;
