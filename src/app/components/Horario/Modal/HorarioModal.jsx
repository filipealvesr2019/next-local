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
import styles from './HorarioModal.module.css'

export default function HorarioModal({ onSuccess }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { apiUrl } = useConfig();
  const AdminID = Cookies.get("AdminID");

  const [storeID, setStoreID] = useState(null);

  const [formData, setFormData] = useState({
    adminID: AdminID,
    horarios: {
      segunda: { abertura: "", fechamento: "" },
      terca: { abertura: "", fechamento: "" },
      quarta: { abertura: "", fechamento: "" },
      quinta: { abertura: "", fechamento: "" },
      sexta: { abertura: "", fechamento: "" },
      sabado: { abertura: "", fechamento: "" },
      domingo: { abertura: "", fechamento: "" }
    }
  });

  async function handleGetEcommerce() {
    try {
      const response = await axios.get(`${apiUrl}/api/loja/admin/${AdminID}`);
      setStoreID(response.data._id);
      setFormData((prevFormData) => ({
        ...prevFormData,
        storeID: response.data._id,
      }));
    } catch (error) {
      console.error("Erro ao carregar loja:", error);
    }
  }

  useEffect(() => {
    handleGetEcommerce();
  }, []);

  const handleChange = (e, day, type) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      horarios: {
        ...formData.horarios,
        [day]: {
          ...formData.horarios[day],
          [type]: value,
        },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/api/admin/horario-funcionamento`, {
        adminID: formData.adminID,
        horarios: formData.horarios
      });
      onSuccess();
      alert(response.data.message);
    } catch (error) {
      console.error("Erro ao salvar horários:", error);
      alert("Erro ao salvar horários.");
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Cadastrar Horário</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cadastrar Horário de Funcionamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <form onSubmit={handleSubmit} className={styles.form}>
                {Object.keys(formData.horarios).map((day) => (
                  <div key={day} className={styles.dayRow}>
                    <FormLabel>{day.charAt(0).toUpperCase() + day.slice(1)}</FormLabel>
                    <Input
                      type="time"
                      value={formData.horarios[day].abertura}
                      onChange={(e) => handleChange(e, day, "abertura")}
                      required
                    />
                    <Input
                      type="time"
                      value={formData.horarios[day].fechamento}
                      onChange={(e) => handleChange(e, day, "fechamento")}
                      required
                    />
                  </div>
                ))}
              </form>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Salvar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
