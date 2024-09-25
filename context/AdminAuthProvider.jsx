import React, { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAtom } from 'jotai';
import { isAdminAtom, loggedInAtom, authErrorAtom, AdminIDAtom } from '../store/store'; // Adicione o customerIDAtom
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const adminAuthProvider  = ({ children }) => {
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const [adminID, setAdminID] = useAtom(AdminIDAtom); // Adicione o estado para customerID

  useEffect(() => {
    const storedToken = Cookies.get('AdminToken');  // Use AdminToken
    const storedRole = Cookies.get('AdminRole');    // Use AdminRole
    const storedAdminID= Cookies.get('AdminID');
  
    setLoggedIn(Boolean(storedToken));
    setIsAdmin(storedRole === 'administrador');
    setAdminID(storedAdminID);
  }, [setLoggedIn, setIsAdmin, setAdminID]);
  

  return <>{children}</>;
};

export default adminAuthProvider ;

export const adminAuth = () => {
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const [adminID, setAdminID] = useAtom(AdminIDAtom); // Adicione o estado para customerID
  const [error, setError] = useAtom(authErrorAtom);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3002/api/login', { email, password });

      if (response.data.user.role === 'administrador') {
        setLoggedIn(true);
        setIsAdmin(true);
      } else {
        alert('Credenciais inválidas');
      }

      Cookies.set('AdminToken', response.data.token);
      Cookies.set('AdminRole', response.data.user.role);
      Cookies.set('AdminID', response.data.user._id);
      setAdminID(response.data.user._id);
      
      console.log(adminID)
    } catch (error) {
      setError(error.response.data.error);

      if (error.response && error.response.status === 401) {
        toast.error('Erro, email ou senha inválidos!', { position: toast.POSITION.TOP_CENTER });
      } else {
        console.error('Erro na solicitação de login', error);
      }
    }
  };

  const logout = () => {
    Cookies.remove('AdminToken');
    Cookies.remove('AdminRole');
    Cookies.remove('AdminID');
    
    setLoggedIn(false);
    setIsAdmin(false);
    setAdminID(null); // Limpe o estado do customerID
  };

  return { loggedIn, isAdmin, setAdminID, login, logout, error }; // Retorne o customerID
};
