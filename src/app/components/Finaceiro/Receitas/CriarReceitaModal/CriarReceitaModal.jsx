import React, { useEffect, useState } from "react";
import axios from "axios";
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
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie"; // Certifique-se de importar isso
import DatePicker from "react-datepicker"; // Importando o DatePicker
import { useConfig } from "../../../../../../context/ConfigContext";

export default function InitialFocus({ onSuccess }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const { apiUrl } = useConfig();
  const AdminID = Cookies.get("AdminID");

  const [formData, setFormData] = useState({
    adminID: AdminID,
    type: "receita",
    description: "",
    amount: "",
    category: "",
    paymentDate: new Date(), // Inicializa o campo paymentDate com a data atual
    createdAt: new Date()
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // Função para lidar com a mudança de data
  const handlePaymentDateChange = (date) => {
    setFormData({
      ...formData,
      paymentDate: date,
  

    });
  };
 // Função para lidar com a mudança de data
 const handleCreatedAtChange = (date) => {
  setFormData({
    ...formData,
    createdAt: date,

  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/api/receitas`, formData);
      onSuccess(); // Chama a função passada como prop para atualizar a lista

      alert(response.data.message);
    } catch (error) {
      console.error("Erro ao criar receita:", error);
      alert("Erro ao criar receita.");
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Cadastrar Receita</Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cadastrar Receita</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <form onSubmit={handleSubmit} style={{ marginTop: "5rem" }}>
                <input
                  type="text"
                  name="description"
                  placeholder="Descrição"
                  onChange={handleChange}
                  value={formData.description}
                  required
                />

                {/* Select de categorias */}

                <input
                  type="number"
                  name="amount"
                  placeholder="Valor"
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
                      {category.type === "receita" && (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      )}
                    </>
                  ))}
                </select>
              </form>

              <FormLabel>Data de Vencimento</FormLabel>
              <DatePicker
                selected={formData.paymentDate}
                onChange={handlePaymentDateChange}
                dateFormat="dd/MM/yyyy"
              />
            </FormControl>
            <FormLabel>Data de Criação</FormLabel>
              <DatePicker
                selected={formData.createdAt}
                onChange={handleCreatedAtChange}
                dateFormat="dd/MM/yyyy"
              />
      
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
