// ExemploComponent.js
import React from "react";
import styles from "./NavBar.module.css";
import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  HamburgerIcon,

} from "@chakra-ui/icons";

const ExemploMenu = () => {
  return (
    <div className={styles.container}>
      <a href="https://imgur.com/eIsbYKG">
        <img
          src="https://i.imgur.com/eIsbYKG.jpg"
          title="source: imgur.com"
          className={styles.img}
        />
      </a>

      <div>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
            className={styles.menuButton}
          />
          <MenuList className={styles.menuList}>
            <MenuItem>Planos</MenuItem>
            <MenuItem>Login</MenuItem>
            <MenuItem>Cadastro</MenuItem>
            <MenuItem>Sobre nos</MenuItem>
            <MenuItem>Contato</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
};

export default ExemploMenu;
