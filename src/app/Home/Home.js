"use client"
import { adminAuth } from "../../../context/AdminAuthProvider";
import LandingPage from "../LandingPage/LandingPage";

export default function HomePage() {
  const {loggedIn} = adminAuth()
    return (
      <>
      {!loggedIn && <LandingPage />
      }
      </>
    )
  }
  