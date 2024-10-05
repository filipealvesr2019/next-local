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
    const handleCartProducts = async ()  => {
        const response = await axios.get(`${apiUrl}/api/cartProducts/${UserID}`)
        setCart(response.data)
        console.log("cart response", response.data)
    }
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
                {cart.map((product) => (
                    <li key={product._id}>{product.name} - {product.price}</li> // Ajuste os campos conforme necessário
                ))}
            </ul>
        ) : (
            <p>Loading...</p>
        )}
        </>
    )
}