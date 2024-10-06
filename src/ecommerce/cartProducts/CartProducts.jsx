"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import Cookies from "js-cookie";
import HeaderContainer from "../StoreContainer/HeaderContainer";

export default function CartProducts() {
    const UserID = Cookies.get("UserID"); // Obtenha o ID do cliente do cookie
    const storeID = Cookies.get("storeID"); // Obtenha o ID do cliente do cookie

    const [cart, setCart] = useState(null);
    const [quantity, setQuantity] = useState(1);
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
            console.log("cart response", response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error fetching cart products:", error.response ? error.response.data : error.message);
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
            storeID: storeID, // Substitua pelo ID da loja
            items: cart.map(product => ({
                productID: product._id,
                name: product.name,
                price: product.price,
                quantity: quantity,
    
                imageUrl: product.imageUrl, // Adicione o campo imageUrl aqui

            })),
            paymentMethod: paymentMethod,
        };

        try {
            const response = await axios.post(`${apiUrl}/api/order`, orderData);
            console.log("Order created successfully:", response.data);
            // Aqui você pode adicionar uma lógica para mostrar uma mensagem de sucesso ou redirecionar
        } catch (error) {
            console.error("Error finalizing order:", error);
        }
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
                        </li>
                    ))}
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
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="Pix"
                                checked={paymentMethod === 'Pix'}
                                onChange={() => setPaymentMethod('Pix')}
                            />
                            PIX
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Cartão de Credito"
                                checked={paymentMethod === 'Cartão de Credito'}
                                onChange={() => setPaymentMethod('Cartão de Credito')}
                            />
                            Cartão de Crédito
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Dinheiro"
                                checked={paymentMethod === 'Dinheiro'}
                                onChange={() => setPaymentMethod('Dinheiro')}
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
