"use client";
import "./globals.css";
import { ConfigProvider } from "../../context/ConfigContext"; // Ensure this import is correct
import AdminAuthProvider from "../../context/AdminAuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider>
          <AdminAuthProvider>
            {children}
          </AdminAuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
