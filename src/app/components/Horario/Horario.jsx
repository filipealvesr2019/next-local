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
      setTerca(response.data.horarioFuncionamento.terca.isOpen);

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
                  <Th p={2}>Segunda</Th>
                  <Th p={2}>Terça</Th>
                  <Th p={2}>Quarta</Th>
                  <Th p={2}>Quinta</Th>
                  <Th p={2}>Sexta</Th>
                  <Th p={2}>Sábado</Th>
                  <Th p={2}>Domingo</Th>
                  <Th p={2}>Excluir</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td p={2}>
                    {data?.segunda
                      ? `${data.segunda.abertura} - ${data.segunda.fechamento}`
                      : "Fechado"}
                  </Td>
                  <Td p={2}>
                    {data?.terca
                      ? `${data.terca.abertura} - ${data.terca.fechamento}`
                      : "Fechado"}
                  </Td>
                  <Td p={2}>
                    {data?.quarta
                      ? `${data.quarta.abertura} - ${data.quarta.fechamento}`
                      : "Fechado"}
                  </Td>
                  <Td p={2}>
                    {data?.quinta
                      ? `${data.quinta.abertura} - ${data.quinta.fechamento}`
                      : "Fechado"}
                  </Td>
                  <Td p={2}>
                    {data?.sexta
                      ? `${data.sexta.abertura} - ${data.sexta.fechamento}`
                      : "Fechado"}
                  </Td>
                  <Td p={2}>
                    {data?.sabado
                      ? `${data.sabado.abertura} - ${data.sabado.fechamento}`
                      : "Fechado"}
                  </Td>

                  <Td p={2}>
                    {data?.domingo?.isOpen
                      ? `${data.domingo.abertura} - ${data.domingo.fechamento}`
                      : "Fechado"}
                  </Td>

                  <Td p={2}>
                    <EditIcon onClick={() => openUpdateModal()} />
                    {data.length < 0 ? (
                      ""
                    ) : (
                      <DeleteIcon
                        style={{ color: "#C0392B", cursor: "pointer" }}
                        onClick={() => openDeleteModal()}
                      />
                    )}
                  </Td>
                </Tr>
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
                    value={data?.terca?.abertura}
                    required
                    className={styles.Input}
                    mb={1} /* Aplicando também no segundo Input */
                  />
                  <Input
                    type="time"
                    value={data?.terca?.fechamento}
                    required
                    className={styles.Input}
                  />
                    <Select placeholder="Esta Fechado?" value={terca === true ? 'true' : 'false'} onChange={(e) => setSegunda(e.target.value)}>
                  <option value="true">Aberto</option>
                  <option value="false">Fechado</option>
                  </Select>

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
