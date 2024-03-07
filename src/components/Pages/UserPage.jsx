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
import { getUserCMU } from "../../firebase";
import { v4 as uuidv4 } from "uuid";

function UserPage() {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const [pdfData, setPdfData] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [userData, setUserData] = useState("");
  const [userDataEmail, setUserDataEmail] = useState("");

  const location = useLocation();
  const { userCMUObject } = location.state;

  const handleLogout = async () => {
    try {
      if (userData) {
        await deleteUserByEmail(userData[0]?.email);
        navigate("/");
      } else {
        await logOut();
        navigate("/");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.email) {
          const documentUrl = await getUrl(user.email);
          console.log("documentUrl", documentUrl);
        } else {
          const documentUrl = await getUrl(userDataEmail);
          console.log("documentUrl", documentUrl);
        }
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      }
    };

    fetchData();
  }, [user?.email, userDataEmail]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documents = await getCreatedDocuments();
        setPdfData(documents);
        console.log("documents:", documents);
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserCMU();
        console.log(data);
        setUserDataEmail(data[0].email);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSignDocument = async () => {
    if (selectedType) {
      try {
        const CMUUid = uuidv4();
        if (userData) {
          console.log("CMU");
          // await SignDoc(
          //   userDataEmail,
          //   CMUUid,
          //   selectedType,
          //   fileName,
          //   content,
          //   url
          // );
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
      {userCMUObject.name} Test
      {userData ? (
        <>
          {userData.map((s) => (
            <div key={s.id}>
              {s.name} {s.lastName} : {s.studentId}
            </div>
          ))}
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
      </div>
    </div>
  );
}

export default UserPage;
