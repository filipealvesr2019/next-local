"use client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  Input,
  FormLabel,
} from "@chakra-ui/react";
import DeleteIcon from "@mui/icons-material/Delete";

import { useConfig } from "../../../../context/ConfigContext";
import HorarioModal from "./Modal/HorarioModal";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./Horario.module.css";
import { Select } from "@chakra-ui/react";
export default function Horario() {
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie

  const { apiUrl } = useConfig();
  const [data, setData] = useState([]);
  const [deleteProduct, setDeleteProduct] = useState([]);
  const [segunda, setSegunda] = useState('')
  const [terca, setTerca] = useState('')

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const {
    isOpen: isUpdateModalOpen,
    onOpen: onOpenUpdateModal,
    onClose: onCloseUpdateModal,
  } = useDisclosure();
  const openUpdateModal = () => {
    onOpenUpdateModal();
  };

  const fetchProducts = async () => {
    await getProducts();
  };
  // console.log("adminEccommerceID", adminEccommerceID)
  async function getProducts() {
    try {
      const response = await axios.get(
        `${apiUrl}/api/admin/horario-funcionamento/${AdminID}`
      );
      setData(response.data.horarioFuncionamento || []);
      setSegunda(response.data.horarioFuncionamento.segunda.isOpen);
      setSegunda(response.data.horarioFuncionamento.segunda.isOpen);

    } catch (error) {
      console.error("Error fetching products:", error);
      setData([]);
    }
  }
  useEffect(() => {
    getProducts();
  }, []);
  const openDeleteModal = (id) => {
    setDeleteProduct({ _id: id });
    onOpenDeleteModal();
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/admin/horario-funcionamento/${AdminID}`
      );
      await getProducts();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",

          // Habilita a rolagem apenas dentro dessa área
        }}
      >
        <div
          style={{
            marginTop: "10rem",
          }}
        >
          <HorarioModal onSuccess={fetchProducts} />
          <TableContainer
            style={{
              border: "1px solid #edf2f7",
              borderRadius: "10px",
              maxHeight: "400px",
              overflowY: "auto",
              maxWidth: "80vw",
            }}
          >
            <Table variant="simple" style={{ backgroundColor: "white" }}>
              <Thead>
                <Tr>
                  <Th >Dia</Th>
                  <Th >Abertura</Th>
                  <Th p={1}>Fechamento</Th>
                  <Th >Status</Th>
                  <Th >Editar</Th>
                  <Th >Excluir</Th>
                </Tr>
              </Thead>
              <Tbody>
                {["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"].map((dia) => (
                  <Tr key={dia}>
                    <Td >{dia.charAt(0).toUpperCase() + dia.slice(1)}</Td>
                    <Td  >{data[dia]?.abertura || "Fechado"}</Td>
                    <Td p={1}>{data[dia]?.fechamento || "Fechado"}</Td>
                    <Td >{data[dia]?.isOpen ? "Aberto" : "Fechado"}</Td>
                    <Td >
                      <EditIcon onClick={() => openUpdateModal(data[dia])} />
                    </Td>
                    <Td >
                      <DeleteIcon
                        style={{ color: "#C0392B", cursor: "pointer" }}
                        onClick={() => openDeleteModal(data[dia]?._id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Modal para confirmar a exclusão de despesa */}
          <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Excluir Produto</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p>Tem certeza que deseja excluir esse Produto?</p>
              </ModalBody>
              <ModalFooter onClick={handleDeleteProduct}>
                <Button colorScheme="blue" mr={3} onClick={onCloseDeleteModal}>
                  Salvar
                </Button>
                <Button onClick={onCloseDeleteModal}>Cancelar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para confirmar a exclusão de despesa */}
          <Modal isOpen={isUpdateModalOpen} onClose={onCloseUpdateModal} size={'xl'}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Atualizar Horário de Funcionamento</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl className={styles.FormControl}>
                <FormLabel>Segunda</FormLabel>

                  <Input
                    type="time"
                    value={data?.segunda?.abertura}
                    required
                    className={styles.Input}
                  />
                  <Input
                    type="time"
                    value={data?.segunda?.fechamento}
                    required
                    className={styles.Input}
                  />
                  <Select placeholder="Esta Fechado?" value={segunda === true ? 'true' : 'false'} onChange={(e) => setSegunda(e.target.value)}>
                  <option value="true">Aberto</option>
                  <option value="false">Fechado</option>
                  </Select>

                  <FormLabel>Terça</FormLabel>

                  <Input
                    type="time"
                    value={data?.segunda?.abertura}
                    required
                    className={styles.Input}
                    mb={1} /* Aplicando também no segundo Input */
                  />
                  <Input
                    type="time"
                    value={data?.segunda?.fechamento}
                    required
                    className={styles.Input}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter onClick={handleDeleteProduct}>
                <Button colorScheme="blue" mr={3} onClick={onCloseUpdateModal}>
                  Salvar
                </Button>
                <Button onClick={onCloseUpdateModal}>Cancelar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
}
