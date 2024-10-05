import axios from "axios";
import { useEffect, useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import Cookies from "js-cookie";
import Header from "../header/Header";

export default function Container(){
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

    

    const storeNAME = Cookies.get("storeNAME"); // Supondo que o ID do usuário está armazenado em um cookie

    useEffect(() => {
      const fetchEcommerce = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/api/loja/${storeNAME}`
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
        
        } catch (error) {
          console.error("Erro ao buscar o e-commerce:", error);
        }
      };
  
      fetchEcommerce();
    }, []);
    
return (
    <>
         <Header
              headerColorFrame={headerColorFrame}
              headerBackgroundColor={headerBackgroundColor}
              headerTextColorFrame={headerTextColorFrame}
              headerColor={headerColor}
              logo={logo}
              layout={layout}
            />
           
    </>
)
}