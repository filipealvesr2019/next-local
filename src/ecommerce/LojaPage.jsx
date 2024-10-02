import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./Navbar/Navbar";
import Tabs from "./tabs/Tabs";
import SearchBar from "./SearchBar/SearchBar";
import Layout1 from "../ecommerce/layout/Layout1.module.css";
import Layout2 from "../ecommerce/layout/Layout2.module.css";
import Header from '../ecommerce/header/Header'
import ProductsList from './Products/ProductsList';
import { useConfig } from "../../context/ConfigContext";
import { useSetAtom } from "jotai";
import { storeID } from "../../store/store";
import { Chat } from "@mui/icons-material";
const LojaPage = () => {
  const [ecommerce, setEcommerce] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState("");
  const [headerColor, setHeaderColor] = useState("");
  const [mainBackgroundColor, setMainBackgroundColor] = useState("");
  const [mainColor, setMainColor] = useState("");
  const [footerBackgroundColor, setFooterBackgroundColor] = useState("");
  const [footerColor, setFooterColor] = useState("");
  const [logo, setLogo] = useState("");
  const [layout, setLayout] = useState("");
  const [headerColorFrame, setHeaderColorFrame] = useState(
    headerBackgroundColor
  );
  const [headerTextColorFrame, setHeaderTextColorFrame] = useState(headerColor);
  const [mainColorFrame, setMainColorFrame] = useState(mainBackgroundColor);
  const [mainTextColorFrame, setMainTextColorFrame] = useState(mainColor);
  const [footerColorFrame, setFooterColorFrame] = useState(mainBackgroundColor);
  const [footerTextColorFrame, setFooterTextColorFrame] = useState(mainColor);
  const { apiUrl } = useConfig();
  const setStoreID = useSetAtom(storeID);

  const { subdomain } = useParams();
  useEffect(() => {
    const fetchEcommerce = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/loja/${subdomain}`
        );
        setEcommerce(response.data);
        setLogo(response.data.theme.header.Logo);
        setHeaderBackgroundColor(response.data.theme.header.backgroundColor);
        setHeaderColor(response.data.theme.header.color);
        setMainBackgroundColor(response.data.theme.main.backgroundColor);
        setMainColor(response.data.theme.main.color);
        setFooterBackgroundColor(response.data.theme.footer.backgroundColor);
        setLayout(response.data.layout);
        setFooterColor(response.data.theme.footer.color);
        console.log('store',response.data._id)
     // Resetando o adminID sempre que a loja mudar
     if (response.data._id) {
      setStoreID(response.data._id); // Atualiza o átomo com o novo ID
      Cookies.set("storeID", response.data._id, {
        sameSite: "None",
        secure: true,
      }); // Persiste o adminID no cookie
      console.log("storeID atualizado e salvo:", response.data._id);
    } else {
      console.warn("storeID não encontrado na resposta da API.");
    }
      } catch (error) {
        console.error("Erro ao buscar o e-commerce:", error);
      }
    };

    fetchEcommerce();
  }, [setStoreID]);
  
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

 
  if (!ecommerce) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.screenContainer}>
          <div
            style={{ backgroundColor: mainBackgroundColor, color: mainColor }}
          >
             <Header
              headerColorFrame={headerColorFrame}
              headerBackgroundColor={headerBackgroundColor}
              headerTextColorFrame={headerTextColorFrame}
              headerColor={headerColor}
              logo={logo}
              layout={layout}
            />
           
            <Tabs />
            <main
              className={styles.main}
              style={{
                backgroundColor: mainColorFrame
                  ? mainColorFrame
                  : mainBackgroundColor,
                color: mainTextColorFrame ? mainTextColorFrame : mainColor,
              }}
            >

              <ProductsList />
            </main>
            <footer
              style={{
                backgroundColor: footerColorFrame
                  ? footerColorFrame
                  : footerBackgroundColor,
                color: footerTextColorFrame
                  ? footerTextColorFrame
                  : footerColor,
              }}
              className={styles.footer}
            >
              <span>Footer da Loja</span>
              
            </footer>

            <div
              id="carrosel"
              style={{
                marginTop: "15rem",
                color: "black",
              }}
            >
              {/* Carrossel content here */}
              carrosel loja
              <Chat />fffffffff

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LojaPage;

