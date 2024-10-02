"use client";
import { useEffect, useState } from "react";
import { adminAuth } from "../../../context/AdminAuthProvider";
import LandingPage from "../LandingPage/LandingPage";

export default function HomePage() {
  const { loggedIn } = adminAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Garantir que o componente só seja montado no lado do cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Evitar renderizar até que o componente esteja montado no cliente
    return null;
  }

  return (
    <>
      {!loggedIn && <LandingPage />}
      
    </>
  );
}
