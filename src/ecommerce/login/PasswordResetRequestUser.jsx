import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';


import styles from './PasswordResetRequestUser.module.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3003/api/user/forgot-password', { email });
      toast.success("Email de recuperação enviado com sucesso cheque a sua caixa de email!");

    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <>
      <Header />

      <div className={styles.formContainer}>
        <h1 className={styles.formContainer__h1}>Redefinir Senha</h1>
     
        <form onSubmit={handleSubmit} className={styles.formContainer__form}>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ marginTop: "8rem" }}
        />
  
            <input type="email" value={email} onChange={handleEmailChange} placeholder='digite seu email...' required className={styles.formContainer__input} />


           
     <div>          <button type="submit" className={styles.formContainer__button}>Enviar</button>
     </div>
        </form>
  
      </div>
    </>
  );
};

export default PasswordResetRequest;