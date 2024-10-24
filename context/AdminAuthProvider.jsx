"use client";
import React, { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useAtom } from "jotai";
import {
  isAdminAtom,
  loggedInAtom,
  authErrorAtom,
  AdminIDAtom,
  isAttendantAtom,
  AttendantIDAtom,
} from "../store/store"; // Adicione o customerIDAtom
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminAuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const [adminID, setAdminID] = useAtom(AdminIDAtom); // Estado do Admin
  const [isAttendant, setIsAttendant] = useAtom(isAttendantAtom);
  const [attendantID, setAttendantID] = useAtom(AttendantIDAtom); // Estado do Atendente

  useEffect(() => {
    const storedAdminToken = Cookies.get("AdminToken");
    const storedAdminRole = Cookies.get("AdminRole");
    const storedAdminID = Cookies.get("AdminID");
  
    const storedAttendantToken = Cookies.get("AttendantToken");
    const storedAttendantRole = Cookies.get("AttendantRole");
    const storedAttendantID = Cookies.get("AttendantID");
  
    // Logs para depuração
    console.log("AdminToken: ", storedAdminToken);
    console.log("AdminRole: ", storedAdminRole);
    console.log("AttendantToken: ", storedAttendantToken);
  
    // Autenticação de Admin
    if (storedAdminToken && storedAdminRole === "administrador") {
      setLoggedIn(true);
      setIsAdmin(true);
      setAdminID(storedAdminID);
    } else {
      console.log("Admin not authenticated.");
    }
  
    // Autenticação de Atendente
    if (storedAttendantToken && storedAttendantRole === "atendente") {
      setLoggedIn(true);
      setIsAttendant(true);
      setAttendantID(storedAttendantID);
    } else {
      console.log("Attendant not authenticated.");
    }
  }, [setLoggedIn, setIsAdmin, setAdminID, setIsAttendant, setAttendantID]);
  
  return <>{children}</>;
};

export default AdminAuthProvider;

export const adminAuth = () => {
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const [adminID, setAdminID] = useAtom(AdminIDAtom);
  const [isAttendant, setIsAttendant] = useAtom(isAttendantAtom);
  const [attendantID, setAttendantID] = useAtom(AttendantIDAtom);
  const [error, setError] = useAtom(authErrorAtom);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3002/api/login", {
        email,
        password,
      });

      const { role, _id, token } = response.data.user;

      if (role === "administrador") {
        setLoggedIn(true);
        setIsAdmin(true);
        setAdminID(_id);
        Cookies.set("AdminToken", token);
        Cookies.set("AdminRole", role);
        Cookies.set("AdminID", _id);
      } else if (role === "atendente") {
        setLoggedIn(true);
        setIsAttendant(true);
        setAttendantID(_id);
        Cookies.set("AttendantToken", token);
        Cookies.set("AttendantRole", role);
        Cookies.set("AttendantID", _id);
      } else {
        alert("Credenciais inválidas");
      }
    } catch (error) {
      setError(error.response.data.error);

      if (error.response && error.response.status === 401) {
        toast.error("Erro, email ou senha inválidos!", {
          position: "top-center",
        });
      } else {
        console.error("Erro na solicitação de login", error);
      }
    }
  };

  const logout = () => {
    // Limpeza dos cookies e estados de admin
    Cookies.remove("AdminToken");
    Cookies.remove("AdminRole");
    Cookies.remove("AdminID");
    setIsAdmin(false);
    setAdminID(null);

    // Limpeza dos cookies e estados de atendente
    Cookies.remove("AttendantToken");
    Cookies.remove("AttendantRole");
    Cookies.remove("AttendantID");
    setIsAttendant(false);
    setAttendantID(null);

    setLoggedIn(false);
  };

  return {
    loggedIn,
    isAdmin,
    adminID,
    isAttendant,
    attendantID,
    login,
    logout,
    error,
  };
};
