// Header.js

import React from "react";

import Layout1 from "../layout/Layout2.module.css";
import Layout2 from "../layout/Layout2.module.css";
import { useAuth } from "../context/UserAuthProvider";
import UserFormContainer from "../UserForm/UserFormContainer/UserFormContainer";

const Footer = ({
  footerColorFrame,
  footerBackgroundColor,
  footerTextColorFrame,
  footerColor,
  layout,
}) => {
  const {loggedIn} = useAuth() 

  const layoutStyles = () => {
    switch (layout) {
      case "layout1":
        return Layout1;
      case "layout2":
        return Layout2;
      default:
        return {}; // Retorna um objeto vazio se nenhum layout for encontrado
    }
  };

  const styles = layoutStyles(); // Chame a função para obter o estilo correto

  return (
    <footer
      style={{
        backgroundColor: footerColorFrame
          ? footerColorFrame
          : footerBackgroundColor,
        color: footerTextColorFrame ? footerTextColorFrame : footerColor,
      }}
      className={styles.footer}
    >
            {loggedIn ? <UserFormContainer /> : ''}

      <span>Footer da Loja</span>
    </footer>
  );
};

export default Footer;
