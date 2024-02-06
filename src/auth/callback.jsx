import { useState, useEffect } from 'react';  import qs from 'qs';
import { useLocation } from 'react-router-dom';

const CallbackPage = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (location.pathname === "/callback") {
        const codeFromURL = new URLSearchParams(location.search).get("code");

        if (codeFromURL) {
          try {
            const response = await fetch(`https://server-node-tau.vercel.app/getToken/${codeFromURL}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
      
            const result = await response.json();
            setAccessToken(result.result.result);              
            console.log("result :", result.result.result);
          } catch (error) {
            console.error("Wrong to Sign", error.message || "Wrong to Sign");
          }
        }
      }
    };

    fetchData();
  }, [location]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken) {
        try {
          const response = await fetch('https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          const userData = await response.json();
          setUserData(userData);
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };

    fetchUserData();
  }, [accessToken]);

  console.log("userData:",userData)

  return null;
}

export default CallbackPage;
