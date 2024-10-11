"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import Cookies from "js-cookie";
import HeaderContainer from "../StoreContainer/HeaderContainer";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export default function CartProducts() {
  const UserID = Cookies.get("UserID"); // Obtenha o ID do cliente do cookie
  const storeID = Cookies.get("storeID"); // Obtenha o ID da loja do cookie

  const [cart, setCart] = useState(null);
  const [quantities, setQuantities] = useState({}); // Estado para armazenar a quantidade de cada produto
  const [paymentMethod, setPaymentMethod] = useState("Pix"); // Método de pagamento padrão
  const { apiUrl } = useConfig();

  const handleCartProducts = async () => {
    if (!UserID) {
      console.error("UserID is missing.");
      return; // Retorne se o UserID não estiver presente
    }

    try {
      const response = await axios.get(`${apiUrl}/api/cartProducts/${UserID}`);
      setCart(response.data);

      // Inicializar a quantidade de cada produto com 1
      const initialQuantities = {};
      response.data.forEach((product) => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching cart products:",
          error.response ? error.response.data : error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleFinalizeOrder = async () => {
    if (!cart || cart.length === 0) {
      console.error("Cart is empty.");
      return;
    }
  

  
    const orderData = {
      userID: UserID,
      storeID: storeID,
      items: cart.map((product) => ({
        productID: product._id,
        name: product.name,
        price: product.price,
        quantity: quantities[product._id] || 1, // Usar a quantidade específica do produto, padrão para 1
        imageUrl: product.imageUrl,
      })),
      paymentMethod: paymentMethod,
    };
  
    // Log do `orderData` para verificação
  
    try {
      const response = await axios.post(`${apiUrl}/api/order`, orderData);
      console.log("Order created successfully:", response.data);
    } catch (error) {
      console.error("Error finalizing order:", error);
    }
  };
  

  const handleQuantityChange = (productId, amount) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, (prevQuantities[productId] || 1) + amount), // Impede quantidade menor que 1
    }));
  };

  useEffect(() => {
    handleCartProducts();
  }, []);

  return (
    <>
      <HeaderContainer />
      {cart ? (
        <ul style={{ marginTop: "20rem" }}>
          {cart.map((product) => (
            <li key={product._id}>
              {product.name} - {product.price}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RemoveIcon
                  onClick={() => handleQuantityChange(product._id, -1)}
                />
                <div>
                  <label htmlFor="quantity">Quantidade:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantities[product._id] || 1}
                    onChange={(e) =>
                      setQuantities({
                        ...quantities,
                        [product._id]: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <AddIcon
                  onClick={() => handleQuantityChange(product._id, 1)}
                />
              </div>
            </li>
          ))}

          <div>
            <label>
              <input
                type="radio"
                value="Pix"
                checked={paymentMethod === "Pix"}
                onChange={() => setPaymentMethod("Pix")}
              />
              PIX
            </label>
            <label>
              <input
                type="radio"
                value="Cartão de Credito"
                checked={paymentMethod === "Cartão de Credito"}
                onChange={() => setPaymentMethod("Cartão de Credito")}
              />
              Cartão de Crédito
            </label>
            <label>
              <input
                type="radio"
                value="Dinheiro"
                checked={paymentMethod === "Dinheiro"}
                onChange={() => setPaymentMethod("Dinheiro")}
              />
              Dinheiro
            </label>
          </div>
          <button onClick={handleFinalizeOrder}>Finalizar Pedido</button>
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
