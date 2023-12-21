import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import { getSignedDocument } from "../../firebase";

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
        console.log("Fetched Documents:", documents);
        setSignedDocuments(documents);
      } catch (error) {
        console.error("Error fetching signed documents:", error);
      }
    };

    fetchSignedDocuments();
  }, []);

  return (
    <div>
      <div>
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
              <strong>URL:</strong> {document.url}
              <br />
              <strong>Type:</strong> {document.type}
              <br />
              <strong>Date:</strong>
              {document.timestamp
                ? document.timestamp.toDate().toLocaleString()
                : "N/A"}
              <br />
              <strong>signDate:</strong>
              <br />
              <strong>Status:</strong> {document.action}
              <br />
              <button className="your-button-class">
                {document && (
                  <Link to="/Detail" state={{ document }}>
                    Details
                  </Link>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPage;
