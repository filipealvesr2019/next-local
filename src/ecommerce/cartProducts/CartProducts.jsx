"use client"
import axios from "axios";
import { useEffect, useState } from "react"
import { useConfig } from "../../../context/ConfigContext";
import Cookies from "js-cookie";
import HeaderContainer from "../StoreContainer/HeaderContainer";
export default function CartProducts(){
    const UserID = Cookies.get("UserID"); // Obtenha o ID do cliente do cookie
    const [cart, setCart] = useState(null);
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
    useEffect(() => {
        handleCartProducts()
    }, [])
    return (
        <>
        <HeaderContainer />
            {cart ? (
            <ul style={{
                marginTop:"20rem"
            }}>
                {cart?.map((product) => (
                    <li key={product._id}>{product.name} - {product.price}</li> // Ajuste os campos conforme necessário
                ))}
            </ul>
        ) : (
            <p>Loading...</p>
        )}
        </>
    )
}