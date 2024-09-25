// ConfigContext.js
import React, { createContext, useState } from 'react';
const localhost = 'http://localhost:3002'
const apiUrl = 'https://64f22388c1f395658e3d59cd7fc11988.serveo.net';
export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    apiUrl: localhost,
  });



  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => React.useContext(ConfigContext);