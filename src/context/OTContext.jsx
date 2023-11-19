import React, { createContext, useState } from "react";

const init = {
  email: "",
  password: "",
};

const DataContext = createContext();

function DataContextProvider({ children }) {
  const [data, sd] = useState(init);

  function setData(e) {
    sd((state) => {
      return {
        ...state,
        [e.target.name]: e.target.value,
      };
    });
  }
  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataContextProvider };
