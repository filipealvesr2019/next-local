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
import { adminAuth } from "../../../context/AdminAuthProvider";
import { useAuth } from "../context/UserAuthProvider";
export default function ProductDetails({ name, productId }) {
  const { apiUrl } = useConfig();
  const [data, setData] = useState(null); // Alterado de [] para null
  const [selectedVariations, setSelectedVariations] = useState({});
  const [quantity, setQuantity] = useState(1); // Adicionado campo de quantidade
  const [paymentMethod, setPaymentMethod] = useState(""); // Estado para o método de pagamento
  const [cartCount, setCartCount] = useAtom(cartCountAtom); // Adicione esta linha
  const [isRegistered, setIsRegistered] = useState(false); // Armazena os dados do usuário
  const [error, setError] = useState(null); // Armazena qualquer erro
  const [message, setMessage] = useState("");
  const UserID = Cookies.get("UserID"); // Obtenha o ID do cliente do cookie
  const router = useRouter();
  const storeID = Cookies.get("storeID"); // Obtenha o ID do cliente do cookie
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOFFLINEOpen,
    onOpen: onOpenOFFLINEModal,
    onClose: onCloseOFFLINEModal,
  } = useDisclosure();
  const { loggedIn } = useAuth();

  // Função para formatar o subdomínio
  const formatProductNameForURL = (str) => {
    return str
      .normalize("NFD") // Normaliza a string para decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
      .toLowerCase() // Converte para letras minúsculas
      .replace(/\s+/g, "-") // Substitui espaços por hífens
      .replace(/[^\w\-]+/g, ""); // Remove caracteres não alfanuméricos (exceto hífens)
  };
  const {
    isOpen: isHoursModalOpen,
    onOpen: onOpenHoursModal,
    onClose: onCloseHoursModal,
  } = useDisclosure();
  const [horario, setHorario] = useState(false);

  const storeNAME = Cookies.get("storeNAME"); // Obtenha o ID do cliente do cookie

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

  const isWithinOperatingHours = () => {
    const now = new Date();
    const currentDay = now
      .toLocaleString("pt-BR", { weekday: "long" })
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Normalização do dia

    // Log para verificar o valor de currentDay
    console.log(`Valor original do dia: ${currentDay}`);

    // Mapeia o dia atual para a chave correta no objeto horario
    const diasDaSemanaMap = {
      "segunda-feira": "segunda", // Alterado para corresponder à chave correta
      "terca-feira": "terca",
      "quarta-feira": "quarta",
      "quinta-feira": "quinta",
      "sexta-feira": "sexta",
      sabado: "sabado",
      domingo: "domingo",
    };

    const diaAtual = diasDaSemanaMap[currentDay]; // Mapeia o dia atual para a chave correta

    console.log(`Dia atual: ${diaAtual}`); // Log do dia atual

    // Log para verificar o objeto de horários
    console.log("Horários disponíveis:", JSON.stringify(horario, null, 2));

    // Verifica se o horário está definido para o dia atual
    if (!horario || !horario[diaAtual]) {
      console.log(`Horário não definido para ${diaAtual}`);
      return false; // Se não houver horário, retorna falso
    }

    const { abertura, fechamento, isOpen } = horario[diaAtual];

    // Verifica se a loja está aberta
    if (!isOpen) {
      console.log(`A loja está fechada hoje, ${diaAtual}.`);
      return false;
    }

    // Valida se os horários de abertura e fechamento estão definidos
    if (!abertura || !fechamento) {
      console.log(`Horário não definido para ${diaAtual}`);
      return false; // Se algum horário não estiver definido, retorna falso
    }

    const [openingHour, openingMinutes] = abertura.split(":").map(Number);
    const [closingHour, closingMinutes] = fechamento.split(":").map(Number);
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openingTime = openingHour * 60 + openingMinutes;
    const closingTime = closingHour * 60 + closingMinutes;

    // Ajustar a lógica para lidar com horários de fechamento que ocorrem no dia seguinte
    if (closingTime < openingTime) {
      return currentTime >= openingTime || currentTime < closingTime;
    }

    return currentTime >= openingTime && currentTime < closingTime;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verifica se está dentro do horário de funcionamento
    if (!isWithinOperatingHours() && horario) {
      // Remova o parâmetro
      onOpenHoursModal();
      return; // Saia da função se não estiver dentro do horário
    }
    if (!loggedIn) {
      onOpenOFFLINEModal();
    }


    if (!isRegistered && loggedIn) {
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
      console.log("isRegistered", response.data.isRegistered);
    } catch (err) {
      setError("Erro ao carregar os dados do usuário"); // Armazena o erro
    }
  };

  // Executa a função de busca quando o componente é montado
  useEffect(() => {
    fetchUserData();
  }, []);



  
  useEffect(() => {
    const fetchEcommerce = async () => {
      if (!storeNAME) {
        console.error("storeNAME não encontrado no cookie.");
        return;
      }

      console.log("API URL:", apiUrl);

      try {
        const response = await axios.get(`${apiUrl}/api/loja/${storeNAME}`);
        setHorario(response.data.horarioFuncionamento);
        console.log("horarioFuncionamento", response.data.horarioFuncionamento);
      } catch (error) {
        console.error("Erro ao buscar o e-commerce:", error);
      }
    };

    fetchEcommerce();
  }, [apiUrl, storeNAME]); // Adicione dependências

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
        {loggedIn ? (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
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
      ) : (
        <Modal
          closeOnOverlayClick={false}
          isOpen={isModalOFFLINEOpen}
          onClose={onCloseOFFLINEModal}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Logar</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Por favor, para poder continuar com sua compra faça login.{" "}
            </ModalBody>

            <ModalFooter>
              <Link href={"/signin"}>
                <Button colorScheme="blue" mr={3}>
                  Fazer Login
                </Button>
              </Link>
              <Button variant="ghost" onClick={onCloseOFFLINEModal}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}



{horario && loggedIn && !isWithinOperatingHours() && (
        <Modal
          closeOnOverlayClick={false}
          isOpen={isHoursModalOpen}
          onClose={onCloseHoursModal}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Horário de Funcionamento</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Nossos horários de funcionamento são:
              <div>
                Segunda:{" "}
                {horario.segunda.isOpen ? (
                  <>
                    {horario.segunda.abertura} - {horario.segunda.fechamento}
                  </>
                ) : (
                  "Fechado"
                )}
                <br />
                Terça:{" "}
                {horario.terca.isOpen ? (
                  <>
                    {horario.terca.abertura} - {horario.terca.fechamento}
                  </>
                ) : (
                  "Fechado"
                )}
                <br />
                Quarta:{" "}
                {horario.quarta.isOpen ? (
                  <>
                    {horario.quarta.abertura} - {horario.quarta.fechamento}
                  </>
                ) : (
                  "Fechado"
                )}
                <br />
                Quinta:{" "}
                {horario.quinta.isOpen ? (
                  <>
                    {horario.quinta.abertura} - {horario.quinta.fechamento}
                  </>
                ) : (
                  "Fechado"
                )}
                <br />
                Sexta:{" "}
                {horario.sexta.isOpen ? (
                  <>
                    {horario.sexta.abertura} - {horario.sexta.fechamento}
                  </>
                ) : (
                  "Fechado"
                )}
                <br />
                Sábado:{" "}
                {horario.sabado.isOpen ? (
                  <>
                    {horario.sabado.abertura} - {horario.sabado.fechamento}
                  </>
                ) : (
                  "Fechado"
                )}
                <br />
                Domingo:{" "}
                {horario.domingo.isOpen ? (
                  <>
                    {horario.domingo.abertura} - {horario.domingo.fechamento}
                  </>
                ) : (
                  "Fechado"
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onCloseHoursModal}>
                Fechar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
