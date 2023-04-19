import { ThemeProvider } from "@mui/material";
import { theme } from "../utils/theme";
import Navbar from "../components/Navbar.js";
import "../utils/styles.css";
import { NextUIProvider } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { UserContextProvider } from "../store/UserContext";

export default function App({ Component, pageProps }) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <UserContextProvider>
      <ThemeProvider theme={theme}>
        <Navbar onLoginClick={() => setShowLoginModal(true)} />
        <Component {...pageProps} />
      </ThemeProvider>
    </UserContextProvider>
  );
}
