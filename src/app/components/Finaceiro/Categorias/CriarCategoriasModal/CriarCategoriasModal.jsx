import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

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
import { useConfig } from "../../../../../../context/ConfigContext";
export default function InitialFocus({onSuccess}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const { apiUrl } = useConfig();
  const AdminID = Cookies.get("AdminID");

  const [formData, setFormData] = useState({
    adminID: AdminID,
    type: "receita", // Valor padrão
    name: "",
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
      const response = await axios.post(`${apiUrl}/api/categories`, formData);
      alert(response.data.message);
      onSuccess()
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Erro ao criar categoria.");
    }
  };
  return (
    <>
      <Button onClick={onOpen}>Cadastrar Categoria</Button>

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
                  name="name"
                  placeholder="Nome da categoria"
                  onChange={handleChange}
                  value={formData.name}
                  required
                />

                {/* Select para escolher tipo de categoria */}
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                  <option value="loja">Loja</option>

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
