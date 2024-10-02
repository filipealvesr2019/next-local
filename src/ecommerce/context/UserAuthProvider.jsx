import React, { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAtom } from 'jotai';
import { isCustomerAtom, loggedInCustomerAtom, authErrorAtom, customerIDAtom } from '../../../store/store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useConfig } from '../../../context/ConfigContext';

const userAuthProvider  = ({ children }) => {
  const [loggedIn, setLoggedIn] = useAtom(loggedInCustomerAtom);
  const [isUser, setIsUser] = useAtom(isCustomerAtom);
  const [customerID, setCustomerID] = useAtom(customerIDAtom);
  useEffect(() => {
    const storedToken = Cookies.get('UserToken');  // Use UserToken
    const storedRole = Cookies.get('UserRole');    // Use UserRole
    const storedCustomerID = Cookies.get('UserID');
  
    setLoggedIn(Boolean(storedToken));
    setIsUser(storedRole === 'User');
    setCustomerID(storedCustomerID);
  }, [setLoggedIn, setIsUser, setCustomerID]);
  

  return <>{children}</>;
};

export default userAuthProvider ;

export const useAuth = () => {
  const [loggedIn, setLoggedIn] = useAtom(loggedInCustomerAtom);
  const [isUser, setIsUser] = useAtom(isCustomerAtom);
  const [customerID, setCustomerID] = useAtom(customerIDAtom);
  const [error, setError] = useAtom(authErrorAtom);
  const { apiUrl } = useConfig();

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/api/loginUser`, { email, password });

      if (response.data.user.role === 'User') {
        setLoggedIn(true);
        setIsUser(true);
      } else {
        alert('Credenciais inválidas');
      }
      Cookies.set('UserToken', response.data.token, { sameSite: 'None', secure: true });
      Cookies.set('UserRole', response.data.user.role, { sameSite: 'None', secure: true });
      Cookies.set('UserID', response.data.user._id, { sameSite: 'None', secure: true });
      
      setCustomerID(response.data.user._id);
      
    } catch (error) {
      setError(error.response?.data?.error || 'Erro desconhecido');
      console.error('Erro na solicitação de login', error);
    }
  };



  const logout = () => {
    Cookies.remove('UserToken');
    Cookies.remove('UserRole');
    Cookies.remove('UserID');
    
    setLoggedIn(false);
    setIsUser(false);
    setCustomerID(null);
  };

  return { loggedIn, isUser, customerID,  login, logout, error };
};
