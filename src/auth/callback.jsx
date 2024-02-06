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
            const requestData = {
              code: codeFromURL,
              redirect_uri: 'https://final-project-eta-ruby.vercel.app/callback',
              client_id: 'dBH4CNbDdruZ8qyD3qqubEYdVz5xvpnqsDe7yrQb',
              client_secret: 'tYEyZQnjDzQ11j8JQDjdTQh0deHEkAfNKnaqaArf',
              grant_type: 'authorization_code',
            };

          

const options = {
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  data: qs.stringify(requestData),
};


            // const requestOptions = {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/x-www-form-urlencoded'
            //   },
            //   body: new URLSearchParams(requestData)
            // };

            // const response = await fetch('https://oauth.cmu.ac.th/v1/GetToken.aspx', requestOptions);
            // const data = await response.json();
            const response = await axios.post("https://oauth.cmu.ac.th/v1/GetToken.aspx",options);
            console.log(response.data);
            setAccessToken(response.data.access_token);
          } catch (error) {
            console.error('Error:', error.message);
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
