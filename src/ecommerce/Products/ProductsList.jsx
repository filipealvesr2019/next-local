import axios from "axios";
import { useEffect, useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import styles from "./ProductDetails.module.css";
import { useAtom } from "jotai";
import { cartCountAtom, storeID } from "../../../store/store";
import Cookies from "js-cookie";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
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
import { adminAuth } from "../../../context/AdminAuthProvider";
import { useAuth } from "../context/UserAuthProvider";
export default function Products() {
  const { apiUrl } = useConfig();
  const [data, setData] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [ecommerceID, setEcommerceID] = useAtom(storeID); // Use corretamente o atom
  const [toggleIcon, setToggleIcon] = useState(false);
  const [message, setMessage] = useState("");
  const [cart, setCart] = useState(new Set()); // Estado para manter os IDs dos produtos no carrinho
  const [cartCount, setCartCount] = useAtom(cartCountAtom); // Use o atom de contagem
  const [isRegistered, setIsRegistered] = useState(false); // Armazena os dados do usuário
  const [error, setError] = useState(null); // Armazena qualquer erro
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loggedIn } = useAuth();
  const {
    isOpen: isModalOFFLINEOpen,
    onOpen: onOpenOFFLINEModal,
    onClose: onCloseOFFLINEModal,
  } = useDisclosure();
  const {
    isOpen: isHoursModalOpen,
    onOpen: onOpenHoursModal,
    onClose: onCloseHoursModal,
  } = useDisclosure();
  const UserID = Cookies.get("UserID"); // Obtenha o ID do cliente do cookie
  const [horario, setHorario] = useState(false);

  const storeNAME = Cookies.get("storeNAME"); // Obtenha o ID do cliente do cookie

  // Função para buscar produtos
  async function getProducts(id) {
    try {
      const response = await axios.get(`${apiUrl}/api/produtos/loja/${id}`);
      setData(response.data || []);

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

  useEffect(() => {
    // Carregar estado do carrinho do localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const savedCount = savedCart.length;

    setCart(new Set(savedCart));
    setCartCount(savedCount);
  }, []);




  const isWithinOperatingHours = () => {
    const now = new Date();
    const currentDay = now.toLocaleString('pt-BR', { weekday: 'long' }).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    console.log(`Dia atual: ${currentDay}`);
    console.log(`Hora atual: ${currentHour}`);
    console.log(`Minutos atuais: ${currentMinutes}`);

    if (!horario || !horario[currentDay]) {
        console.log(`Horário não definido para ${currentDay}`);
        return false;
    }

    const horarioDia = horario[currentDay];
    console.log(`Horário de ${currentDay}:`, horarioDia);

    const [openingHour, openingMinutes] = horarioDia.abertura.split(":").map(Number);
    const [closingHour, closingMinutes] = horarioDia.fechamento.split(":").map(Number);

    const openingTime = openingHour * 60 + openingMinutes;
    const closingTime = closingHour * 60 + closingMinutes;
    const currentTime = currentHour * 60 + currentMinutes;

    return currentTime >= openingTime && currentTime < closingTime;
};


  // Função para adicionar/remover do carrinho
  const toggleCartItem = async (productId, isAdding) => {
    const UserID = Cookies.get("UserID");

    if (!loggedIn) {
      onOpenOFFLINEModal();
    }

    
  // Verifica se está dentro do horário de funcionamento
  // Verifica se está dentro do horário de funcionamento
  if (!isWithinOperatingHours()) { // Remova o parâmetro
    onOpenHoursModal();
    return; // Saia da função se não estiver dentro do horário
  }
    // Se o usuário estiver logado, verifique se está registrado
    if (!isRegistered) {
      onOpen(); // Abra o modal de cadastro se isRegistered for null
      return; // Saia da função para não continuar
    }
    try {
      if (isAdding) {
        await axios.post(`${apiUrl}/api/add-to-cart/${UserID}/${productId}`, {
          quantity: 1,
        });
        setCart((prev) => {
          const newCart = new Set(prev);
          newCart.add(productId);
          localStorage.setItem("cart", JSON.stringify(Array.from(newCart))); // Atualiza o localStorage
          return newCart;
        });
        setCartCount((prevCount) => prevCount + 1);
      } else {
        await axios.delete(`${apiUrl}/api/cart/${UserID}/${productId}`);
        setCart((prev) => {
          const newCart = new Set(prev);
          newCart.delete(productId);
          localStorage.setItem("cart", JSON.stringify(Array.from(newCart))); // Atualiza o localStorage
          return newCart;
        });
        setCartCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.error("Erro ao atualizar o carrinho:", error);
    }
  };

  // Função que busca os dados do usuário
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/userForm/${UserID}`); // Substitua pelo userID dinâmico se necessário

      setIsRegistered(response.data.isRegistered);
      console.log("isRegistered", isRegistered);
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
    <div style={{ marginTop: "15rem" }}>
      {data.length > 0 ? (
        data.map((product) => (
          <div key={product._id} style={{ marginTop: "10rem" }}>
            <Link
              href={`/user/product/${formatProductNameForURL(product.name)}/${
                product._id
              }`}
            >
              <div>
                {product.name}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: "15vw" }}
                />
              </div>
            </Link>
            <div
              onClick={() =>
                toggleCartItem(product._id, !cart.has(product._id))
              }
            >
              {cart.has(product._id) ? (
                <>
                  <CheckCircleOutlinedIcon />
                  remover
                </>
              ) : (
                <>
                  {" "}
                  <AddIcon />
                  adicionar
                </>
              )}
              
            </div>
          </div>
        ))
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
                    Segunda: {horario.segunda.abertura} - {horario.segunda.fechamento}
                    <br />
                    Terça: {horario.terca.abertura} - {horario.terca.fechamento}
                    <br />
                    Quarta: {horario.quarta.abertura} - {horario.quarta.fechamento}
                    <br />
                    Quinta: {horario.quinta.abertura} - {horario.quinta.fechamento}
                    <br />
                    Sexta: {horario.sexta.abertura} - {horario.sexta.fechamento}
                    <br />
                    Sábado: {horario.sabado.abertura} - {horario.sabado.fechamento}
                    <br />
                    Domingo: {horario.domingo.abertura} - {horario.domingo.fechamento}
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
