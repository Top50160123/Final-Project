import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CallbackPage = () => {
  const location = useLocation();
  const [userCmu, setUserCmu] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (location.pathname === "/callback") {
        const codeFromURL = new URLSearchParams(location.search).get("code");

        if (codeFromURL) {
          try {
            const response = await fetch(
              `https://server-node-tau.vercel.app/getToken/${codeFromURL}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setAccessToken(result.access_token);
            console.log("result :", result.access_token);
          } catch (error) {
            console.error("Wrong to Sign", error.message || "Wrong to Sign");
          }
        }
      }
    };

    fetchData();
  }, [location]);
  console.log("Token หน้าบ้าน:", accessToken);

  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken) {
        try {
          const response = await fetch(
            "https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const userData = await response.json();
          setUserCmu(userData);
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, [accessToken]);

  useEffect(() => {
    try{
      if (userCmu) {
        // navigate("/DocumentDownload");
        console.log("Navigate Done",userCmu);
      }
    }catch(error){
      console.error("error")
    }
    // await logIn(email, password)
  }, [navigate, userCmu]);

  return null;
};

export default CallbackPage;
