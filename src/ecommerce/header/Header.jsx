// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import SearchBar from '../SearchBar/SearchBar';
import styles from './Header.module.css'; // Ajuste o caminho para o seu CSS
import Layout1 from "../layout/Layout2.module.css";
import Layout2 from "../layout/Layout2.module.css";
const Header = ({
  headerColorFrame,
  headerBackgroundColor,
  headerTextColorFrame,
  headerColor,
  logo,
  layout
}) => {

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
    <header
      style={{
        backgroundColor: headerColorFrame ? headerColorFrame : headerBackgroundColor,
        color: headerTextColorFrame ? headerTextColorFrame : headerColor,
        cursor: headerBackgroundColor || headerColor ? 'pointer' : '',
      }}
      className={styles.header}
    >
      <Navbar />
      <img style={{ color: 'white', width: '5vw' }} src={logo} alt="Logo" />
      <SearchBar />
      <div className={styles.header__icons}>
        <a href="#">
          <img
            src="https://i.imgur.com/ItjKDhc.png"
            title="source: imgur.com"
            style={{ width: '2.5rem' }}
            alt="Icon"
          />
        </a>
        <Link to="/cart">
          <a href="#">
            <img
              src="https://i.imgur.com/1XrvJJL.png"
              title="source: imgur.com"
              style={{ width: '2.5rem' }}
              alt="Cart"
            />
          </a>
        </Link>
        <Link to="/signin">
          <a href="#">
            <img
              src="https://i.imgur.com/qshOO5Z.png"
              title="source: imgur.com"
              style={{ width: '2.5rem' }}
              alt="Sign In"
            />
          </a>
        </Link>
      </div>
    </header>
  );
};

export default Header;
