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
import Cookies from "js-cookie"; // Certifique-se de importar isso
import axios from "axios";
import { useConfig } from "../../../../../../context/ConfigContext";

export default function InitialFocus({onSuccess}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const { apiUrl } = useConfig();
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie
  const [categories, setCategories] = useState([]);

  // Buscar as categorias do adminID
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/categories/${AdminID}`);
        setCategories(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, [apiUrl, AdminID]);

  const [formData, setFormData] = useState({
    adminID: AdminID,
    type: "receita",
    description: "",
    amount: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/api/despesas`, formData);
      onSuccess()
      alert(response.data.message);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Erro ao criar produto.");
    }
  };
  return (
    <>
      <Button onClick={onOpen}>Cadastrar Despesa</Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cadastrar Despesa</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <form onSubmit={handleSubmit} style={{ marginTop: "5rem" }}>
                <input
                  type="text"
                  name="description"
                  placeholder="description"
                  onChange={handleChange}
                  value={formData.description}
                  required
                />

                <input
                  type="number"
                  name="amount"
                  placeholder="amount"
                  onChange={handleChange}
                  value={formData.amount}
                  required
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Selecione uma categoria
                  </option>
                  {categories.map((category) => (
                   <>
                       {category.type === "despesa" &&  <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                    }
                   
                   </>
                  ))}
                </select>
              </form>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Salvar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
