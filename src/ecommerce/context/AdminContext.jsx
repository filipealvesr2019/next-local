import { createContext, useState } from 'react';

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [adminID, setAdminID] = useState(null);

  return (
    <AdminContext.Provider value={{ adminID, setAdminID }}>
      {children}
    </AdminContext.Provider>
  );
};

export { AdminProvider, AdminContext };