import axios from "axios";
import { useEffect, useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import styles from "./ProductDetails.module.css";
import { useAtom } from "jotai";
import { cartCountAtom, storeID } from "../../../store/store";
import Cookies from "js-cookie";
import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
export default function Products() {
  const { apiUrl } = useConfig();
  const [data, setData] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [ecommerceID, setEcommerceID] = useAtom(storeID); // Use corretamente o atom
  const [toggleIcon, setToggleIcon] = useState(false)
  const [message, setMessage] = useState('');
  const [cart, setCart] = useState(new Set()); // Estado para manter os IDs dos produtos no carrinho
  const [cartCount, setCartCount] = useAtom(cartCountAtom); // Use o atom de contagem

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


  
  // Função para adicionar/remover do carrinho
  const toggleCartItem = async (productId, isAdding) => {
    const UserID = Cookies.get("UserID"); // Supondo que o ID do usuário está armazenado em um cookie
    try {
      if (isAdding) {
        // Adicionar item ao carrinho
        const response = await axios.post(`${apiUrl}/api/cart/${UserID}/${productId}`, {
          quantity: 1, // ou qualquer outra lógica de quantidade que você tenha
        });
        console.log(response.data.message);
        setCart(prev => new Set(prev).add(productId)); // Atualiza o estado do carrinho
        setCartCount(prevCount => prevCount + 1); // Incrementa a contagem

      } else {
        // Remover item do carrinho
        await axios.delete(`${apiUrl}/api/cart/${UserID}/${productId}`);
        setCart(prev => {
          const newCart = new Set(prev);
          newCart.delete(productId); // Remove o produto do estado
          return newCart;
        });
        setCartCount(prevCount => prevCount - 1); // Decrementa a contagem

      }
    } catch (error) {
      console.error("Erro ao atualizar o carrinho:", error);
    }
  };



  return (
    <div style={{ marginTop: "25rem" }}>
      {data.length > 0 ? (
        data.map((product) => (
          <div key={product._id} style={{ marginTop: "10rem" }}>
            <Link href={`/user/product/${formatProductNameForURL(product.name)}/${product._id}`}>
              <div>
                {product.name}
                <img src={product.imageUrl} alt={product.name} style={{ width: "15vw" }} />
              </div>
            </Link>
            <div onClick={() => toggleCartItem(product._id, !cart.has(product._id))}>
              {cart.has(product._id) ? <RemoveIcon /> : <AddIcon />}
            </div>
          </div>
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}
