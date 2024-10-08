"use client";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useConfig } from "../../../context/ConfigContext";
import styles from "./AdminProductDetails.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { cartCountAtom } from "../../../store/store";
import { useAtom } from "jotai";
import HeaderContainer from "@/ecommerce/StoreContainer/HeaderContainer";

export default function AdminProductDetails({ name, productId }) {
  const { apiUrl } = useConfig();
  const [data, setData] = useState(null); // Alterado de [] para null
  const [selectedVariations, setSelectedVariations] = useState({});

  const [message, setMessage] = useState("");

  // Função para formatar o subdomínio
  const formatProductNameForURL = (str) => {
    return str
      .normalize("NFD") // Normaliza a string para decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
      .toLowerCase() // Converte para letras minúsculas
      .replace(/\s+/g, "-") // Substitui espaços por hífens
      .replace(/[^\w\-]+/g, ""); // Remove caracteres não alfanuméricos (exceto hífens)
  };

  // Aplicar a normalização ao subdomínio

  async function getProducts() {
    try {
      const response = await axios.get(
        `${apiUrl}/api/product/${formatProductNameForURL(name)}/${productId}`
      );
      setData(response.data);

      console.log("resposata da api", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setData(null);
    }
  }

  useEffect(() => {
    getProducts();
  }, [apiUrl, productId]);


  return (
    <div style={{ marginTop: "2rem" }}>
      {data ? (
        <div>
          <h2>{data.name}</h2>
          <img src={data.imageUrl} alt={data.name} style={{ width: "15vw" }} />
          <div>
            {data.variations && data.variations.length > 0 ? (
              data.variations.map((variation, index) => (
                <div key={index} className={styles.variationContainer}>
                  <img
                    src={variation.url}
                    alt={variation.name}
                    style={{ width: "15vw" }}
                  />
                  <p>{variation.name}</p>
                  <p>R${variation.price}</p>
             
                </div>
              ))
            ) : (
              <p>No variations available</p>
            )}
          </div>

          

          {message && <p>{message}</p>}
        </div>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}
