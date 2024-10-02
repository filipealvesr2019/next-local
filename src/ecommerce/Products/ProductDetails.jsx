import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useConfig } from "../../../context/ConfigContext";
import styles from "./ProductDetails.module.css";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetails() {
  const { apiUrl } = useConfig();
  const [data, setData] = useState(null); // Alterado de [] para null
  const [selectedVariations, setSelectedVariations] = useState({});
  const [quantity, setQuantity] = useState(1); // Adicionado campo de quantidade
  const AdminID = Cookies.get("AdminID");
  const { productId,name } = useParams();
  const [message, setMessage] = useState('');
  const UserID = Cookies.get("UserID"); // Obtenha o ID do cliente do cookie
  const navigate = useNavigate();

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
      const response = await axios.get(`${apiUrl}/api/product/${formatProductNameForURL(name)}/${productId}`);
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

  const handleVariation = useCallback((productId, variation, index) => {
    const key = `${productId}-${index}`;
    setSelectedVariations((prevState) => {
      if (prevState[key]) {
        const { [key]: _, ...rest } = prevState;
        return rest;
      } else {
        return { ...prevState, [key]: variation };
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const variationsArray = Object.values(selectedVariations);
    try {
      const response = await axios.post(
        `${apiUrl}/api/cart/${UserID}/${productId}`,
        {
          variations: variationsArray,
          quantity,
        }
      );
      setMessage(response.data.message);
      if(response.data){
        navigate('/qrcode')
      }
    
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Erro ao criar pedido.');
      }
    }
  };

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
                  <img src={variation.url} alt={variation.name} style={{ width: "15vw" }} />
                  <p>{variation.name}</p>
                  <p>R${variation.price}</p>
                  <span onClick={() => handleVariation(data._id, variation, index)}>
                    {selectedVariations[`${data._id}-${index}`] ? "-" : "+"}
                  </span>
                </div>
              ))
            ) : (
              <p>No variations available</p>
            )}
          </div>
          
          {/* Campo para selecionar a quantidade */}
          <div>
            <label htmlFor="quantity">Quantidade:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <button onClick={handleSubmit}>Fazer Pedido</button>
          {message && <p>{message}</p>}
        </div>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}