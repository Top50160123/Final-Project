import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 

const YourComponent = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/callback") { 
      const code = new URLSearchParams(location.search); 
      fetch('$request', {
        method: 'POST', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${code.get('code')}` 
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [location]);
}

export default YourComponent;
