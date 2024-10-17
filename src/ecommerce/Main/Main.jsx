// Header.js

import React from "react";

import Layout1 from "../layout/Layout2.module.css";
import Layout2 from "../layout/Layout2.module.css";
import ProductsList from    '../Products/ProductsList'

const Main = ({
  mainColorFrame,
  mainBackgroundColor,
  mainTextColorFrame,
  mainColor,
  layout,
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
    <main
      className={styles.main}
      style={{
        backgroundColor: mainColorFrame ? mainColorFrame : mainBackgroundColor,
        color: mainTextColorFrame ? mainTextColorFrame : mainColor,
      }}
    >
      
      <ProductsList />
    </main>
  );
};

export default Main;
