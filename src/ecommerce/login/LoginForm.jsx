import React, { useState } from "react";
import Profile from "../Profile/Profile";
import LogoutIcon from "@mui/icons-material/Logout";
import "./LoginForm.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";
import { useAuth } from "../../ecommerce/context/UserAuthProvider";



const Login = () => {
  const { loggedIn, isUser, login, logout, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = (response) => {
    console.log('Resposta do Google:', response); // Adicione o log para depuração
    if (response.credential) {
      loginWithGoogle(response.credential);
    } else {
      console.error('Erro ao obter credenciais do Google');
    }
  };

  const handleLogin = () => {
    if (validateForm()) {
      login(email, password);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Campo obrigatório";
    }

    if (!password.trim()) {
      errors.password = "Campo obrigatório";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  if (loggedIn) {
    return (
      <div className="logout-container">
        {isUser ? <Profile /> : ""}
        <div className="button" onClick={logout}>
          <LogoutIcon />
          <span>Sair</span>
        </div>
      </div>
    );
  }

  return (
    <div className="body">
      <div className="container">
        <div className="loginStyle">
          <h1>Login</h1>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            placeholder="Digite o email..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormErrors((prevErrors) => ({ ...prevErrors, email: "" }));
            }}
            className={formErrors.email ? "error" : ""}
            style={{ border: error ? "2px solid red" : "" }}
          />
          {formErrors.email && (
            <span className="error-message">{formErrors.email}</span>
          )}
          <br />
          {error && <p>{error}</p>}
          <div style={{ position: "relative" }}>
            <label htmlFor="password">Senha</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Digite a senha..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormErrors((prevErrors) => ({ ...prevErrors, password: "" }));
              }}
              className={formErrors.password ? "error" : ""}
              style={{ border: error ? "2px solid red" : "" }}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "30px",
                top: "75%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </div>
          </div>
          <div className="loginStyle__button">
            {formErrors.password && (
              <span className="error-message">{formErrors.password}</span>
            )}
            <div className="loginStyle__links">
              <Link to={"/user/register"}>
                <span className="span">
                  Ainda não tem uma conta? <b>Cadastre-se</b>
                </span>
              </Link>
              <Link to={"/forgotPassword"}>
                <span className="span">
                  Esqueceu a senha? <b>Clique aqui</b>
                </span>
              </Link>
            </div>
        
          </div>
          <br />
          <button className="loginButton" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
