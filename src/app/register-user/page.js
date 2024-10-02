 "use client"
import React, { useState } from "react";
import axios from "axios";

import styles from "./RegisterLink.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import { useConfig } from "../../../context/ConfigContext";
const RegisterLink = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { apiUrl } = useConfig();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const role = 'administrador'; // Definindo o papel (role) como 'customer' por padrão

    try {
      const newUser = { email, password, role };
      await axios.post(`${apiUrl}/api/admin/register/request`, newUser);
      // Limpar o formulário após o envio bem-sucedido
      setEmail("");
      setPassword("");
      setError("");
      toast.success("Email enviado com sucesso cheque a sua caixa de email!");

    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <>
      <Header />


      <div  className={styles.formContainer}>
        <h1 className={styles.formContainer__h1}>Digite seu email</h1>
        {error && <p>{error}</p>}
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
            <label className={styles.formContainer__label}>Email:</label>
            <div className={styles.formContainer__div}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.formContainer__input}
                placeholder="email@exemplo.com"
              />
            <button type="submit" className={styles.formContainer__button}>Enviar</button>


          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterLink;