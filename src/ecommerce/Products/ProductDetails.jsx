"use client";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useConfig } from "../../../context/ConfigContext";
import styles from "./ProductDetails.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { cartCountAtom } from "../../../store/store";
import { useAtom } from "jotai";
import HeaderContainer from "../StoreContainer/HeaderContainer";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import UserFormContainer from "../UserForm/UserFormContainer/UserFormContainer";
export default function ProductDetails({ name, productId }) {
  const { apiUrl } = useConfig();
  const [data, setData] = useState(null); // Alterado de [] para null
  const [selectedVariations, setSelectedVariations] = useState({});
  const [quantity, setQuantity] = useState(1); // Adicionado campo de quantidade
  const [paymentMethod, setPaymentMethod] = useState(""); // Estado para o método de pagamento
  const [cartCount, setCartCount] = useAtom(cartCountAtom); // Adicione esta linha
  const [isRegistered, setIsRegistered] = useState(null); // Armazena os dados do usuário
  const [error, setError] = useState(null); // Armazena qualquer erro

  const [message, setMessage] = useState("");
  const UserID = Cookies.get("UserID"); // Obtenha o ID do cliente do cookie
  const router = useRouter();
  const storeID = Cookies.get("storeID"); // Obtenha o ID do cliente do cookie
  const { isOpen, onOpen, onClose } = useDisclosure();

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
  // No componente ProductDetails
  useEffect(() => {
    // Carregar estado do carrinho do localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const savedCount = savedCart.length;
    setCartCount(savedCount);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistered) {
      onOpen();
    }
    const variationsArray = Object.values(selectedVariations);
    try {
      const response = await axios.post(
        `${apiUrl}/api/add-to-cart/${UserID}/${productId}`,
        {
          variations: variationsArray,
          quantity,
          productId,
        }
      );
      setMessage(response.data.message);
      // Atualiza o cartCount e localStorage após o sucesso
      setCartCount((prevCount) => prevCount + quantity);
      const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = [...currentCart, productId]; // ou outros dados que você deseja salvar
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Erro ao criar pedido.");
      }
    }
  };

  // Função que busca os dados do usuário
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/userForm/${UserID}`); // Substitua pelo userID dinâmico se necessário

      setIsRegistered(response.data.isRegistered);
      console.log("fetchUserData", response.data.isRegistered);
    } catch (err) {
      setError("Erro ao carregar os dados do usuário"); // Armazena o erro
    }
  };

  // Executa a função de busca quando o componente é montado
  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div style={{ marginTop: "2rem" }}>
      {data ? (
        <div>
          <HeaderContainer />
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
                  <span
                    onClick={() => handleVariation(data._id, variation, index)}
                  >
                    {selectedVariations[`${data._id}-${index}`] ? "-" : "+"}
                  </span>
                </div>
              ))
            ) : (
              <p>No variations available</p>
            )}
          </div>

          <button onClick={handleSubmit}>Fazer Pedido</button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Cadastre-se</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Por favor, para poder continuar com sua compra cadastre-se.{" "}
              </ModalBody>

              <ModalFooter>
                <Link href={"/UserForm"}>
                  <Button colorScheme="blue" mr={3}>
                    Cadastrar
                  </Button>
                </Link>
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {message && <p>{message}</p>}
        </div>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}
