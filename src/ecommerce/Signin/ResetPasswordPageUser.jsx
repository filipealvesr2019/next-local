import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import style from "./ResetPasswordPageUser.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ResetPasswordPage = () => {
  const { token } = useParams(); // Extrai o token da URL

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Verifica se o token está presente na URL
    if (!token) {
      setMessage('Token inválido.');
    }
  }, [token]);

  const handleResetPassword = async () => {
    try {alert
      // Verificar se as senhas coincidem
      if (newPassword !== confirmPassword) {
        setMessage('As senhas não coincidem.');
        return;
      }

      // Enviar a solicitação para redefinir a senha
      const response = await axios.post('http://localhost:3002api/user/reset-password/:token', {
        token,
        newPassword,
        confirmPassword,
      });

      // Exibir a mensagem de sucesso
      setMessage(response.data.error);
      toast.success("Senha atualisada com sucesso!");

    } catch (error) {
      // Exibir mensagens de erro
      setMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <Header />
      <div className={style.formContainer}>
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
      <h2  className={style.formContainer__h2}>Redefinir Senha</h2>
      <div className={style.flex}>
        <span  className={style.formContainer__span}>      {message  && <p>{message}</p>}
        </span>
        <label           className={style.formContainer__label}
        >Nova Senha:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={style.formContainer__input}
        />
      </div>
      <div className={style.flex}>
        <label  className={style.formContainer__label}>Confirmar Senha:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={style.formContainer__input}

        />
      </div>
      <button onClick={handleResetPassword}           className={style.formContainer__button}
      >Redefinir Senha</button>

      </div>
    </div>
  );
};

export default ResetPasswordPage;