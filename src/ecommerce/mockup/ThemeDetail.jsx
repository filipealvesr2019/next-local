import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout1 from "../ecommerce/layout/Layout1.module.css";
import Layout2 from "../ecommerce/layout/Layout2.module.css";
import Layout3 from "../ecommerce/layout/Layout3.module.css";
import Layout4 from "../ecommerce/layout/Layout4.module.css";
import Layout5 from "../ecommerce/layout/Layout5.module.css";
import Layout6 from "../ecommerce/layout/Layout6.module.css";
import Cookies from "js-cookie";

const ThemeDetail = () => {
  const { id } = useParams();
  const [theme, setTheme] = useState(null);
  const [error, setError] = useState(null);
  const [layout, setLayout] = useState("");
  const [switchIcon, setSwitchIcon] = useState(true); // Alterei para booleano
  const [themeID, setThemeID] = useState(""); // Alterei para booleano
  const [ecommerce, setEcommerce] = useState(null);

  const [headerBackgroundColor, setHeaderBackgroundColor] = useState("");
  const [headerColor, setHeaderColor] = useState("");
  const [icon, setIcon] = useState("");
  const [mainBackgroundColor, setMainBackgroundColor] = useState("");
  const [mainColor, setMainColor] = useState("");
  const [footerBackgroundColor, setFooterBackgroundColor] = useState("");
  const [footerColor, setFooterColor] = useState("");
  const [logo, setLogo] = useState("");
  
  const [showCart, setshowCart] = useState(false);

  const customerID = Cookies.get("customerID"); // Obtenha o ID do cliente do cookie
  const [ecommerceID, setEcommerceID] = useState("");
  useEffect(() => {
    const fetchEcommerce = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/ecommerce/user/${customerID}`
        );
        
        setEcommerceID(response.data._id);
       
      } catch (error) {
        console.error("Erro ao buscar o e-commerce:", error);
      }
    };

    fetchEcommerce();
  }, []);
  
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/theme/${id}`
        );
        setTheme(response.data);
        setLayout(response.data.layout);
        


  
        setLogo(response.data.theme.header.Logo);
        setHeaderBackgroundColor(response.data.theme.header.backgroundColor);
        setHeaderColor(response.data.theme.header.color);
        setMainBackgroundColor(response.data.theme.main.backgroundColor);
        setIcon(response.data.theme.header.icons);

        setMainColor(response.data.theme.main.color);
        setFooterBackgroundColor(response.data.theme.footer.backgroundColor);
        setFooterColor(response.data.theme.footer.color);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTheme();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!theme) {
    return <div>Loading...</div>;
  }
  const layoutStyles = () => {
    switch (layout) {
      case "layout1":
        return Layout1;
      case "layout2":
        return Layout2;
      case "layout3":
        return Layout3;
      case "layout4":
        return Layout4;
      case "layout5":
        return Layout5;
      case "layout6":
        return Layout6;
      default:
        return {}; // Retorna um objeto vazio se nenhum layout for encontrado
    }
  };

  const styles = layoutStyles(); // Chame a função para obter o estilo correto

  const handleClickSwitchIcon = () => {
    setSwitchIcon(!switchIcon);
  };


  
  const handleSaveTheme = async () => {
    try {
      await axios.put(
        `http://localhost:3002/api/ecommerce/${ecommerceID}/update-theme`,
        {
          theme: {
            header: {
              backgroundColor: headerBackgroundColor,
              color: headerColor,
            },
            main: { backgroundColor: mainBackgroundColor, color: mainColor },
            footer: {
              backgroundColor: footerBackgroundColor,
              color: footerColor,
            },
          },
        }
      );
 
      alert("Tema atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o tema:", error);
    }
  };

  return (
    <div className={styles.themeDetailContainer}>
      <div className={styles.section}>
      <button onClick={handleSaveTheme} style={{
            color: "white",
            cursor: "pointer",
          }}>Instalar Tema</button>

        <span
          style={{
            color: "white",
            cursor: "pointer",
          }}
          onClick={handleClickSwitchIcon}
        >
          {switchIcon ? "modo desktop" : "modo celular"}
        </span>
        <a
          onClick={handleClickSwitchIcon}
          style={{
            color: "white",
            cursor: "pointer",
          }}
        >
          <img
            src={
              switchIcon
                ? "https://i.imgur.com/9TngDuX.png"
                : "https://i.imgur.com/A2cWRwb.png"
            }
            title="source: imgur.com"
          />
        </a>
      </div>

      {switchIcon ? (
        <>
          {" "}
          <h1>{theme.name}</h1>
          <p>
            <strong>Categoria :</strong> {theme.category}
          </p>
          <div style={{ display: "flex", gap: "10px", flexDirection:"column" }}>
            <div
              style={{
                backgroundColor: theme.theme.header.backgroundColor,
                color: theme.theme.header.color,
                padding: "10px",
                height:"50vh"
              }}
            >
              <p>Header</p>
            </div>
            <div
              style={{
                backgroundColor: theme.theme.main.backgroundColor,
                color: theme.theme.main.color,
                padding: "10px",
                    height:"50vh"
              }}
            >
              <p>Main</p>
            </div>
            <div
              style={{
                backgroundColor: theme.theme.footer.backgroundColor,
                color: theme.theme.footer.color,
                padding: "10px",
               
                height:"50vh"
              }}
            >
              <p>Footer</p>
            </div>
           
          </div>
        </>
      ) : (
        <>
          {" "}
          <h1>{theme.name}</h1>
          <p>
            <strong>Categoria Mobile:</strong> {theme.category}
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              style={{
                backgroundColor: theme.theme.header.backgroundColor,
                color: theme.theme.header.color,
                padding: "10px",
              }}
            >
              <p>Header Mobile</p>
            </div>
            <div
              style={{
                backgroundColor: theme.theme.footer.backgroundColor,
                color: theme.theme.footer.color,
                padding: "10px",
              }}
            >
              <p>Footer Mobile</p>
            </div>
            <div
              style={{
                backgroundColor: theme.theme.main.backgroundColor,
                color: theme.theme.main.color,
                padding: "10px",
              }}
            >
              <p>Main Mobile</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeDetail;
