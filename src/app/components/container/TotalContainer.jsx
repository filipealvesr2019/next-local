import { useConfig } from "../../../context/ConfigContext";
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Total from "../total/Total";

export default function TotalContainer() {
  const { apiUrl } = useConfig();
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do Admin
  const [storeID, setStoreID] = useState(null); // Inicializa como null até ser recuperado

  async function handleGetEcommerce() {
    try {
      const response = await axios.get(`${apiUrl}/api/loja/admin/${AdminID}`);
      setStoreID(response.data._id); // Define o storeID quando recuperado da API
    } catch (error) {
      console.error("Erro ao buscar a loja:", error);
    }
  }

  useEffect(() => {
    handleGetEcommerce();
  }, []);

  // Verifica se o storeID já foi definido, se não, exibe um loader
  if (!storeID) {
    return <div>Carregando loja...</div>;
  }

  return (
    <>
      <Total storeID={storeID} />
    </>
  );
}
