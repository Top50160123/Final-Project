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
// import { getUserCMU } from "../../firebase";
import { v4 as uuidv4 } from "uuid";

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
          console.log("CMU", location.state.email);
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

  console.log("urlSign", urlSign);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getUserCMU();
  //       console.log(data);
  //       setUserDataEmail(data[0].email);
  //       setUserData(data);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

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

  return (
    <div>
      <h2>Welcome</h2>
      {location.state ? (
        <>
          <div>Name: {location.state.name}</div>
          <div>Last Name: {location.state.lastName}</div>
          <div>Student ID: {location.state.studentId}</div>
        </>
      ) : (
        <>{user?.email}</>
      )}
      <button onClick={handleLogout} variant="danger">
        Logout
      </button>
      <div>
        <h3>PDF Data</h3>
        <label>Select Type:</label>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
          }}
        >
          <option value="">Select Type</option>
          {pdfData.map((d) => (
            <option key={d.id} value={d.data.fileName}>
              {d.data.fileName}
            </option>
          ))}
        </select>

        {selectedType && (
          <div>
            <button onClick={handleSignDocument}>Confirm Sign</button>
          </div>
        )}

        <div>
          {urlSign &&
            urlSign.files &&
            Object.keys(urlSign.files).map((key) => (
              <div key={key}>
                <div>File Name: {urlSign.files[key].fileName}</div>
                <div>
                  Action:
                  {urlSign.files[key].action === "reject" ? (
                    <div>ไม่อนุญาตให้ download </div>
                  ) : (
                    <div>อนุญาตให้ Download</div>
                  )}
                </div>
                <div>Date: {urlSign.files[key].date}</div>
                <div>
                  <a
                    href={urlSign.files[key].url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
        </div>
        <div>{urlSignEmail}</div>
      </div>
    </div>
  );
}

export default UserPage;
