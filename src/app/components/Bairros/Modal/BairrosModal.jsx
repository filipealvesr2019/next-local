import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useConfig } from "../../../../../context/ConfigContext";
export default function BairrosModal({ onSuccess }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const { apiUrl } = useConfig();
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie

  const [storeID, setStoreID] = useState(null);

  const [formData, setFormData] = useState({
    adminID: AdminID,
    storeID: null, // Inicialmente null, será atualizado quando o storeID for recuperado
    cidade: "",
    estado: "",
    bairro: "",
   
  });

  async function handleGetEcommerce() {
    try {
      const response = await axios.get(`${apiUrl}/api/loja/admin/${AdminID}`);
      setStoreID(response.data._id);

      // Atualize o formData com o storeID assim que ele for recuperado
      setFormData((prevFormData) => ({
        ...prevFormData,
        storeID: response.data._id,
      }));
    } catch (error) {
      console.error("Error showing ecommerce:", error);
    }
  }

  useEffect(() => {
    handleGetEcommerce();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      // Encontre o nome da categoria correspondente ao ID selecionado
      const selectedCategory = categories.find(
        (category) => category._id === value
      );
      setFormData({
        ...formData,
        category: value,
        categoryName: selectedCategory ? selectedCategory.name : "", // Atualize também o nome da categoria
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleVariationChange = (index, e) => {
    const { name, value } = e.target;
    const newVariations = [...formData.variations];
    newVariations[index] = {
      ...newVariations[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      variations: newVariations,
    });
  };

  const handleAddField = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      variations: [
        ...prevFormData.variations,
        { url: "", price: "", name: "" },
      ], // Adiciona um novo campo vazio
    }));
  };

  const handleRemoveField = (index) => {
    setFormData((prevFormData) => {
      const newVariations = prevFormData.variations.filter(
        (_, i) => i !== index
      );
      return {
        ...prevFormData,
        variations: newVariations,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.storeID) {
      alert("Store ID ainda não foi carregado.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/admin/post/cep`, formData);
      onSuccess();
      alert(response.data.message);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Erro ao criar produto.");
    }
  };

  const [categories, setCategories] = useState([]);

  // Buscar as categorias do adminID
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/categories/${AdminID}`);
        setCategories(response.data);
        console.log("categories", response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, [apiUrl, AdminID]);

  return (
    <>
      <Button onClick={onOpen}>Cadastrar Locais</Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cadastrar Produto</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <form onSubmit={handleSubmit} style={{ marginTop: "5rem" }}>
                <input
                  type="text"
                  name="bairro"
                  placeholder="bairro"
                  onChange={handleChange}
                  value={formData.bairro}
                  required
                />
              
                <input
                  type="text"
                  name="estado"
                  placeholder="estado"
                  onChange={handleChange}
                  value={formData.estado}
                  required
                />
                <input
                  type="cidade"
                  name="cidade"
                  placeholder="cidade"
                  onChange={handleChange}
                  value={formData.cidade}
                  required
                />

            


       
              </form>{" "}
            </FormControl>
          </ModalBody>

          <ModalFooter onClick={handleSubmit}>
            <Button colorScheme="blue" mr={3}>
              Salvar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
