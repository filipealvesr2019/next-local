"use client"
import "./globals.css";
import AdminAuthProvider from "../../context/AdminAuthProvider";


export default function RootLayout({ children }) {
  return (
 

    <html lang="en">
      <body>
      <AdminAuthProvider >
        {children}
        </AdminAuthProvider>

      </body>
    </html>

  );
}
