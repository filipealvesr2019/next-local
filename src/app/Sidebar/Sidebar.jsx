"use client"
import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import styles from "./Sidebar.module.css";

import HeaderSidebar from "../components/HeaderSidebar/HeaderSidebar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { adminAuth } from "../../../context/AdminAuthProvider";
import PIX from "../Payments/PIX";


// import Email from "./Email/Email";

import Products from "../Products/Products";
import Link from "next/link";
import StoreContainer from "../components/container/storeContainer";
import Home from "../page";
import Finaceiro from "../components/Finaceiro/Finaceiro";
import Bairros from "../components/Bairros/Bairros";
import Horario from "../components/Horario/Horario";
import AlarmSoundsPage from "@/components/AlarmSoundsPage/AlarmSoundsPage";

const HomeIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 20V14H14V20H19V10H16L10 3.5L4 10H1V20H6V14H10V20Z" />
  </svg>
);

const StarIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 15L4.9 18L6.2 11.6L2 7.8L8.4 7L10 1L11.6 7L18 7.8L13.8 11.6L15.1 18L10 15Z" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path d="M7 18C6.447 18 6 18.447 6 19C6 19.553 6.447 20 7 20C7.553 20 8 19.553 8 19C8 18.447 7.553 18 7 18ZM1 2V4H2L5.6 11.59L4.24 14.04C4.089 14.322 4 14.648 4 15C4 15.553 4.447 16 5 16H17V14H5.42C5.28 14 5.18 13.89 5.24 13.76L6.1 12H13.55C13.988 12 14.383 11.754 14.552 11.349L17.846 3.736C17.948 3.495 18 3.253 18 3C18 2.447 17.553 2 17 2H4.21L3.27 0H1ZM16 18C15.447 18 15 18.447 15 19C15 19.553 15.447 20 16 20C16.553 20 17 19.553 17 19C17 18.447 16.553 18 16 18Z" />
  </svg>
);

const UserIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 10C12.761 10 15 7.761 15 5C15 2.239 12.761 0 10 0C7.239 0 5 2.239 5 5C5 7.761 7.239 10 10 10ZM10 12C7.347 12 0 13.347 0 16V18H20V16C20 13.347 12.653 12 10 12Z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 13.333C8.16 13.333 6.667 11.84 6.667 10C6.667 8.16 8.16 6.667 10 6.667C11.84 6.667 13.333 8.16 13.333 10C13.333 11.84 11.84 13.333 10 13.333ZM20 11.333V8.667H17.973C17.813 8.24 17.64 7.827 17.453 7.427L19.107 5.773L16.227 2.893L14.573 4.547C14.173 4.36 13.76 4.187 13.333 4.027V2H10.667V4.027C10.24 4.187 9.827 4.36 9.427 4.547L7.773 2.893L4.893 5.773L6.547 7.427C6.36 7.827 6.187 8.24 6.027 8.667H4V11.333H6.027C6.187 11.76 6.36 12.173 6.547 12.573L4.893 14.227L7.773 17.107L9.427 15.453C9.827 15.64 10.24 15.813 10.667 15.973V18H13.333V15.973C13.76 15.813 14.173 15.64 14.573 15.453L16.227 17.107L19.107 14.227L17.453 12.573C17.64 12.173 17.813 11.76 17.973 11.333H20Z" />
  </svg>
);

const Sidebar = () => {
  const [openCartModal, setOpenCartModal] = useState(false);
  const modalRef = useRef(null);
  const [content, setContent] = useState("home");
  const { logout } = adminAuth(); // Obtenha a função de logout

  const handleClickOpenModal = () => {
    setOpenCartModal(!openCartModal);
  };

  const handleClickCloseModal = () => {
    setOpenCartModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        openCartModal
      ) {
        setOpenCartModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openCartModal]);

  return (
    <>


      <div className={styles.SidebarContainer}>
        <div className={styles.HeaderSidebar}>
          <HeaderSidebar />
        </div>
        <Box className={styles.sidebar}>
          <div className={styles.logo}>
            <span>LOGO</span>
          </div>
          <Flex
            className={styles.sidebarItem}
            onClick={() => setContent("home")}
          >
            <div className={styles.HomeIcon}>
              <HomeIcon />
            </div>
            <Text className={styles.itemText}>Home</Text>
          </Flex>
          <Flex
            className={styles.sidebarItem}
            onClick={() => setContent("Produtos")}
          >
            <StarIcon />
            <Text className={styles.itemText}>Produtos</Text>
          </Flex>
          <Flex
            className={styles.sidebarItem}
            onClick={() => setContent("Pagamentos")}
          >
            <SettingsIcon />
            <Text className={styles.itemText}>Pagamentos</Text>
          </Flex>
          <Flex
            className={styles.sidebarItem}
            onClick={() => setContent("Pedidos")}
          >
            <ShoppingCartIcon />
            <Text className={styles.itemText}>Pedidos</Text>
          </Flex>
          <Flex
            className={styles.sidebarItem}
            onClick={() => setContent("Clientes")}
          >
            <UserIcon />
            <div className={styles.itemIcons} onClick={handleClickOpenModal}>
              <Text className={styles.itemText}>Configurar Loja</Text>
              {openCartModal ? <KeyboardArrowUpIcon /> : <ExpandMoreIcon />}
            </div>
          </Flex>
          {openCartModal && (
            <div className={styles.cartModal}>
              <div ref={modalRef} className={styles.cartModalContent}>
                <Link href={"/looks"}>
                  <span className={styles.span}>Aparência da Loja</span>
                </Link>
                <Link href={"/temas"}>

                <span className={styles.span}>Temas</span>
                </Link>
                
                <span className={styles.span}>Configurar Pagamento</span>
              </div>
            </div>
          )}
              <Flex
            className={styles.sidebarItem}
            onClick={() => setContent("Finaceiro")}
          >
            <SettingsIcon />
            <Text className={styles.itemText}>Finaceiro</Text>
          </Flex>
          <Flex
            className={styles.sidebarItem}
            onClick={() => setContent("Relatorio")}
          >
            <SettingsIcon />
            <Text className={styles.itemText}>Relatórios</Text>
          </Flex>
          <Flex
            className={styles.sidebarItem}
            onClick={() => setContent("Bairros")}
          >
            <SettingsIcon />
            <Text className={styles.itemText}>Bairros</Text>
          </Flex>
          <Flex
            className={styles.sidebarItem}
            onClick={() => setContent("Horario")}
          >
            <SettingsIcon />
            <Text className={styles.itemText}>Horario</Text>
          </Flex>
          <Flex
            className={styles.sidebarItem}
            onClick={() => setContent("alarme")}
          >
            <SettingsIcon />
            <Text className={styles.itemText}>alarme</Text>
          </Flex>
          
          <Button
            className={styles.sidebarItem}
            onClick={logout}
            variant="outline"
            colorScheme="teal"
            mt="auto" // Move o botão para o final da barra lateral
          >
            Logout
          </Button>
        </Box>

        <div className={styles.content}>
        {content === "home" && <Home />}
          {content === "Produtos" && <Products />}
          
          {content === "Pagamentos" && <PIX />}
          {content === "Pedidos" && <StoreContainer />}
          {/* {content === "Email" && <Email />} */}
          {content === "Finaceiro" && <Finaceiro />}
          {content === "Relatório" && <Finaceiro />}
          {content === "Bairros" && <Bairros />}
          {content === "Horario" && <Horario />}
          {content === "alarme" && <AlarmSoundsPage />}

          
           
          
          {/* <div style={{marginTop:"-1rem"}}>

     <Signup />
    </div> */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;