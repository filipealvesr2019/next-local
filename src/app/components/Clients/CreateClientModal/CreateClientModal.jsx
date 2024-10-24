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
    FormControl,
    FormLabel,
    Input,
    Switch,
    useToast,
  } from "@chakra-ui/react";
  import React, { useState } from "react";
  import axios from "axios";
import { useConfig } from "../../../../../context/ConfigContext";
import Cookies from "js-cookie";

  export default function CreateClientModal({ onSuccess }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { apiUrl } = useConfig();
    const AdminID = Cookies.get("AdminID");

    const [components, setComponents] = useState([
      { name: "Componente 1", enabled: false },
      { name: "Componente 2", enabled: false },
      { name: "Componente 3", enabled: false },
    ]);
    
    const toast = useToast();
  
    // Função para lidar com a mudança dos switches de componentes
    const handleComponentChange = (index) => {
      const updatedComponents = [...components];
      updatedComponents[index].enabled = !updatedComponents[index].enabled;
      setComponents(updatedComponents);
    };
  
    // Função para enviar o formulário
    const handleSubmit = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/add-atendente`, {
          adminID: AdminID,
          name,
          email,
          password,
          components,
        });
  
        if (response.data.success) {
          toast({
            title: "Atendente cadastrado com sucesso!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose(); // Fechar o modal após o sucesso
        }
        onSuccess()
      } catch (error) {
        toast({
          title: "Erro ao cadastrar atendente.",
          description: error.response?.data?.message || error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
  
    return (
      <>
        <Button onClick={onOpen}>Cadastrar Atendente</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Cadastrar Atendente</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Nome Completo</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo"
                />
              </FormControl>
  
              <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </FormControl>
  
              <FormControl mt={4}>
                <FormLabel>Senha</FormLabel>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  type="password"
                />
              </FormControl>
  
              {components.map((component, index) => (
                <FormControl key={index} display="flex" alignItems="center" mt={4}>
                  <FormLabel htmlFor={`component${index}`} mb="0">
                    {component.name}
                  </FormLabel>
                  <Switch
                    id={`component${index}`}
                    isChecked={component.enabled}
                    onChange={() => handleComponentChange(index)}
                  />
                </FormControl>
              ))}
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
  