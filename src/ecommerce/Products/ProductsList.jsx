import axios from "axios";
import { useEffect, useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import styles from "./ProductDetails.module.css";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { storeID } from "../../../store/store";
import Cookies from "js-cookie";

export default function Products() {
  const { apiUrl } = useConfig();
  const [data, setData] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [ecommerceID, setEcommerceID] = useAtom(storeID); // Use corretamente o atom

  const [message, setMessage] = useState('');

  // Função para buscar produtos
  async function getProducts(id) {
    try {
      const response = await axios.get(`${apiUrl}/api/produtos/loja/${id}`);
      setData(response.data || []);
      console.log("Produtos", response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setData([]);
    }
  }

  useEffect(() => {
    // Recupera o storeID do cookie
    const savedStoreID = Cookies.get("storeID");

    if (savedStoreID) {
      setEcommerceID(savedStoreID); // Atualiza o atom com o storeID salvo no cookie
      getProducts(savedStoreID); // Usa o storeID para buscar os produtos
      console.log("storeID recuperado dos cookies:", savedStoreID);
    } else if (ecommerceID) {
      getProducts(ecommerceID); // Se não tiver cookie, usa o atom
      console.log("storeID do Atom:", ecommerceID);
    } else {
      console.log("storeID não disponível");
      setData([]); // Limpa os produtos se o storeID não estiver disponível
    }
  }, [ecommerceID, setEcommerceID]); // Dependência do ecommerceID
  // Função para formatar o subdomínio
  const formatProductNameForURL = (str) => {
    return str
      .normalize("NFD") // Normaliza a string para decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
      .toLowerCase() // Converte para letras minúsculas
      .replace(/\s+/g, "-") // Substitui espaços por hífens
      .replace(/[^\w\-]+/g, ""); // Remove caracteres não alfanuméricos (exceto hífens)
  };

  return (
    <div style={{ marginTop: "25rem" }}>
      {data.length > 0 ? (
        data.map((product) => (
          <Link to={`/user/product/${formatProductNameForURL(product.name)}/${product._id}`} key={product._id}>
            <div style={{ marginTop: "10rem" }}>
              {product.name}
              <img src={product.imageUrl} alt={product.name} style={{ width: "15vw" }} />
            </div>
          </Link>
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}
