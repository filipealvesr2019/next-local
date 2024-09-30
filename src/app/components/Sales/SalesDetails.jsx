import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import styles from "./SalesDetails.module.css";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { useConfig } from "../../../context/ConfigContext";

export default function SalesDetails() {
  const { apiUrl } = useConfig();
  const [data, setData] = useState(null); // Alterado de [] para null
  const [selectedVariations, setSelectedVariations] = useState({});
  const [quantity, setQuantity] = useState(1); // Adicionado campo de quantidade
  const AdminID = Cookies.get("AdminID");
  const { productId } = useParams();
  const [message, setMessage] = useState('');
  const UserID = Cookies.get("UserID"); // Obtenha o ID do cliente do cookie
  const navigate = useNavigate();


  async function getProducts() {
    try {
      const response = await axios.get(`${apiUrl}/api/sale/${productId}`);
      setData(response.data);
      console.log(response.data);
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
                  <img src={variation.url} alt={variation.name} style={{ width: "15vw" }} />
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