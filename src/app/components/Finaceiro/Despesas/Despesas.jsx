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
  useStyleConfig,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import Cookies from "js-cookie";
import CriarDespesaModal from "./CriarDespesaModal/CriarDespesaModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "@chakra-ui/react";

import styles from "./Despesas.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
export default function Despesas() {
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [newStatus, setNewStatus] = useState("");
  const [deleteExpense, setDeleteExpense] = useState(null);

  // Use duas instâncias do useDisclosure
  const {
    isOpen: isStatusModalOpen,
    onOpen: onOpenStatusModal,
    onClose: onCloseStatusModal,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mes, setMes] = useState([]);
  const [dia, setDia] = useState([]);
  const [tudo, setTudo] = useState([]);
  const [value, setValue] = useState("mes"); // Estado para armazenar o valor selecionado
  const { apiUrl } = useStyleConfig();
  const [data, setData] = useState([]);
  const fetchDespesas = async () => {
    await getDespesasMes();
    await getDespesasDia();
    await getDespesasTudo();
  };

  // console.log("adminEccommerceID", adminEccommerceID)
  async function getDespesasMes() {
    try {
      const response = await axios.get(`${apiUrl}/api/despesas/mes/${AdminID}`);
      setMes(response.data || []);
      // console.log("getDespesas", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setMes(response.data || []);
      [];
    }
  }
  // console.log("adminEccommerceID", adminEccommerceID)
  async function getDespesasDia() {
    try {
      const response = await axios.get(
        `${apiUrl}/api/despesas-do-dia/${AdminID}`
      );
      setDia(response.data.despesas || []);
      console.log("Dia", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setDia([]);
    }
  }
  // console.log("adminEccommerceID", adminEccommerceID)
  async function getDespesasTudo() {
    try {
      const response = await axios.get(
        `${apiUrl}/api/despesas/tudo/${AdminID}`
      );
      setTudo(response.data || []);
      // console.log("getDespesas", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setTudo([]);
    }
  }
  useEffect(() => {
    getDespesasDia();
    getDespesasMes();
    getDespesasTudo();
  }, []);
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openStatusModal = (revenue) => {
    setSelectedExpense(revenue);
    setNewStatus(revenue.status === "PENDING" ? "RECEIVED" : "PENDING");
    onOpenStatusModal();
  };

  const openDeleteModal = (revenue) => {
    setDeleteExpense(revenue);
    onOpenDeleteModal();
  };

  const handleStatusChange = async () => {
    try {
      await axios.put(
        `${apiUrl}/api/transactions/status/${AdminID}/${selectedExpense._id}`,
        { status: newStatus }
      );
      // Atualize a lista de receitas após a alteração
      await getDespesasMes();
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteExpense = async () => {
    try {
      await axios.delete(
        `${apiUrl}/api/despesas/${AdminID}/${deleteExpense._id}`
      );
      // Atualize a lista de receitas após a alteração
      await getDespesasMes();
      await getDespesasDia();
      await getDespesasTudo();
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleChangeTable = () => {
    switch (value) {
      case "dia":
        return (
          <>
            {dia.length > 0 ? (
              <TableContainer
                style={{
                  border: "1px solid #edf2f7",
                  borderRadius: "10px",
                }}
              >
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Descrição</Th>
                      <Th>Vencimento</Th>
                      <Th>Status</Th>
                      <Th isNumeric>Valor R$</Th>
                      <Th>Categoria</Th>
                      <Th>Excluir</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {dia.map((revenue) => (
                      <Tr key={revenue._id}>
                        <Td>{revenue.description}</Td>
                        <Td>{formatDate(revenue.createdAt)}</Td>
                        <Td
                          className={
                            revenue.status === "RECEIVED"
                              ? styles.received
                              : styles.pending
                          }
                          onClick={() => openStatusModal(revenue)}
                        >
                          {revenue.status === "RECEIVED" ? "PAGO" : "PENDENTE"}
                        </Td>
                        <Td
                          isNumeric
                          className={
                            revenue.type === "despesa"
                              ? styles.typeDespesa
                              : styles.typeReceita
                          }
                        >
                          R${revenue.amount}
                        </Td>
                        <Td>{revenue.categoryName}</Td>
                        <Td
                          style={{
                            color: "#C0392B",
                            cursor:"pointer"

                          }}
                          onClick={() => openDeleteModal(revenue)}
                          
                        >
                          <DeleteIcon />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <p>No receipts available</p>
            )}
          </>
        );

      case "mes":
        return (
          <>
            {mes.length > 0 ? (
              <TableContainer
                style={{
                  border: "1px solid #edf2f7",
                  borderRadius: "10px",
                }}
              >
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Descrição</Th>
                      <Th>Vencimento</Th>
                      <Th>Status</Th>

                      <Th isNumeric>Valor R$</Th>
                      <Th>Categoria</Th>
                      <Th>Excluir</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {mes.map((revenue) => (
                      <Tr key={revenue._id}>
                        <Td>{revenue.description}</Td>
                        <Td>{formatDate(revenue.createdAt)}</Td>
                        <Td
                          className={
                            revenue.status === "RECEIVED"
                              ? styles.received
                              : styles.pending
                          }
                          onClick={() => openStatusModal(revenue)}
                        >
                          {revenue.status === "RECEIVED" ? "PAGO" : "PENDENTE"}
                        </Td>
                        <Td
                          isNumeric
                          className={
                            revenue.type === "despesa"
                              ? styles.typeDespesa
                              : styles.typeReceita
                          }
                        >
                          R${revenue.amount}
                        </Td>

                        <Td>{revenue.categoryName}</Td>
                        <Td
                          style={{
                            color: "#C0392B",
                            cursor:"pointer"

                          }}
                          onClick={() => openDeleteModal(revenue)}
                          
                        >
                          <DeleteIcon />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <p>No products available</p>
            )}
          </>
        );
      case "tudo":
        return (
          <>
            {tudo.length > 0 ? (
              <TableContainer
                style={{
                  border: "1px solid #edf2f7",
                  borderRadius: "10px",
                }}
              >
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Descrição</Th>
                      <Th>Vencimento</Th>
                      <Th>Status</Th>
                      <Th isNumeric>Valor R$</Th>
                      <Th>Categoria</Th>
                      <Th>Excluir</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tudo.map((revenue) => (
                      <Tr key={revenue._id}>
                        <Td>{revenue.description}</Td>
                        <Td>{formatDate(revenue.createdAt)}</Td>
                        <Td
                          className={
                            revenue.status === "RECEIVED"
                              ? styles.received
                              : styles.pending
                          }
                          onClick={() => openStatusModal(revenue)}
                        >
                          {revenue.status === "RECEIVED" ? "PAGO" : "PENDENTE"}
                        </Td>
                        <Td
                          isNumeric
                          className={
                            revenue.type === "despesa"
                              ? styles.typeDespesa
                              : styles.typeReceita
                          }
                        >
                          R${revenue.amount}
                        </Td>
                        <Td>{revenue.categoryName}</Td>
                        <Td
                          style={{
                            color: "#C0392B",
                            cursor:"pointer"
                          }}
                          onClick={() => openDeleteModal(revenue)}
                        >
                          <DeleteIcon />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <p>No receipts available</p>
            )}
          </>
        );
    }
  };

  const handleSelectChange = (e) => {
    setValue(e.target.value);
  };

  const handleTotalChange = () => {
    switch (value) {
      case "dia":
        return <></>;

      case "mes":
        return <></>;
      case "tudo":
        return <></>;
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
        }}
      >
        <Select
          placeholder="Selecione um Periodo"
          onChange={handleSelectChange}
        >
          <option value="dia">Hoje</option>
          <option value="mes">Este Mês</option>
          <option value="tudo">Tudo</option>
        </Select>
      </div>
      <CriarDespesaModal onSuccess={fetchDespesas} />

      <div>{handleChangeTable()}</div>

      {/* Modal para confirmar a alteração de status */}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isStatusModalOpen}
        onClose={onCloseStatusModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              Tem certeza que deseja marcar esta despesa como{" "}
              <b>{newStatus === "RECEIVED" ? "paga" : "pendente"}</b>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleStatusChange}>
              Salvar
            </Button>
            <Button onClick={onCloseStatusModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para confirmar a exclusão de despesa */}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Excluir Despesa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Tem certeza que deseja excluir essa despesa?</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleDeleteExpense}>
              Salvar
            </Button>
            <Button onClick={onCloseDeleteModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
