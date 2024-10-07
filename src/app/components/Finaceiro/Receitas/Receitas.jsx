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
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import CriarReceitaModal from "./CriarReceitaModal/CriarReceitaModal";
import styles from "./Receitas.module.css";

import { Select } from "@chakra-ui/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfig } from "../../../../../context/ConfigContext";
import Link from "next/link";

export default function Receitas() {
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [mes, setMes] = useState([]);
  const [dia, setDia] = useState([]);
  const [tudo, setTudo] = useState([]);
  const [value, setValue] = useState("mes"); // Estado para armazenar o valor selecionado
  const [deleteRevenue, setDeleteRevenue] = useState(null);
  const [receitasAReceberMes, setReceitasAReceberMes] = useState([]);
  const [receitasRecebidasMes, setReceitasRecebidasMes] = useState([]);
  const [receitasRecebidasMesAnterior, setReceitasRecebidasMesAnterior] =
    useState([]);
  const [receitasVencidasMes, setReceitasVencidasMes] = useState([]);

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

  const { apiUrl } = useConfig();

  const fetchReceitas = async () => {
    await getReceitasMes();
    await getReceitasDia();
    await getReceitasTudo();
  };

  async function getReceitasMes() {
    try {
      const response = await axios.get(`${apiUrl}/api/receitas/mes/${AdminID}`);
      setMes(response.data || []);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      setMes([]);
    }
  }

  async function getReceitasDia() {
    try {
      const response = await axios.get(`${apiUrl}/api/receitas/dia/${AdminID}`);
      setDia(response.data || []);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      setDia([]);
    }
  }

  async function getReceitasTudo() {
    try {
      const response = await axios.get(
        `${apiUrl}/api/receitas/tudo/${AdminID}`
      );
      setTudo(response.data || []);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      setTudo([]);
    }
  }

  // console.log("adminEccommerceID", adminEccommerceID)
  async function getTotalReceitasAReceberMes() {
    try {
      const response = await axios.get(
        `${apiUrl}/api/receitas-a-receber/mes/${AdminID}`
      );
      setReceitasAReceberMes(response.data.totalReceitas || []);
      console.log("setTotalReceitasDia", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setData([]);
    }
  }

  // console.log("adminEccommerceID", adminEccommerceID)
  async function getTotalReceitasRecebidasMes() {
    try {
      const response = await axios.get(
        `${apiUrl}/api/receitas-recebidas/mes/${AdminID}`
      );
      setReceitasRecebidasMes(response.data.totalReceitas || []);
      console.log("setTotalReceitasDia", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setData([]);
    }
  }

  // console.log("adminEccommerceID", adminEccommerceID)
  async function getTotalReceitasRecebidasMesAnterior() {
    try {
      const response = await axios.get(
        `${apiUrl}/api/receitas-recebidas/mes/${AdminID}`
      );
      setReceitasRecebidasMesAnterior(response.data.totalReceitas || []);
      console.log("setTotalReceitasDia", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setData([]);
    }
  }

  // console.log("adminEccommerceID", adminEccommerceID)
  async function getTotalReceitasVencidasMes() {
    try {
      const response = await axios.get(
        `${apiUrl}/api/receitas-vencidas/mes-atual/${AdminID}`
      );
      setReceitasVencidasMes(response.data.totalReceitasVencidas || []);
      console.log("setTotalReceitasDia", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setData([]);
    }
  }
  useEffect(() => {
    getReceitasMes();
    getReceitasDia();
    getReceitasTudo();
    getTotalReceitasAReceberMes();
    getTotalReceitasRecebidasMes();
    getTotalReceitasRecebidasMesAnterior();
    getTotalReceitasVencidasMes();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openStatusModal = (revenue) => {
    setSelectedRevenue(revenue);
    setNewStatus(revenue.status === "PENDING" ? "RECEIVED" : "PENDING");
    onOpenStatusModal();
  };

  const openDeleteModal = (revenue) => {
    setDeleteRevenue(revenue);
    onOpenDeleteModal();
  };

  const handleStatusChange = async () => {
    try {
      await axios.put(
        `${apiUrl}/api/transactions/status/${AdminID}/${selectedRevenue._id}`,
        { status: newStatus }
      );
      // Atualize a lista de receitas após a alteração
      await getReceitasMes();
      await getTotalReceitasRecebidasMesAnterior();
      await getTotalReceitasAReceberMes();
      await getTotalReceitasRecebidasMes();
      await getTotalReceitasVencidasMes();
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteRevenue = async () => {
    try {
      await axios.delete(
        `${apiUrl}/api/receitas/${AdminID}/${deleteRevenue._id}`
      );
      // Atualize a lista de receitas após a alteração
      await getReceitasMes();
      await getReceitasDia();
      await getReceitasTudo();
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
                        <Td>{formatDate(revenue.paymentDate)}</Td>
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
                            cursor: "pointer",
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
                         <Link href={`/admin/sales/${revenue.orderID}`}>
                         
                        <Td>{revenue.description}</Td>
                        <Td>{formatDate(revenue.paymentDate)}</Td>
                         </Link>
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
                            cursor: "pointer",
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
                        <Td>{formatDate(revenue.paymentDate)}</Td>
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
                            cursor: "pointer",
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
        return (
          <>

            <div
              style={{
                border: "1px solid gray",
              }}
            >
             A receber R$:{" "} {receitasAReceberMes} -
            </div>

            <div
              style={{
                border: "1px solid gray",
              }}
            >
              Receitas recebidas R$: {receitasRecebidasMes} -
            </div>
            <div
              style={{
                border: "1px solid gray",
              }}
            >
              Receitas vencidas R$: {receitasVencidasMes}
            </div>
            <div
              style={{
                border: "1px solid gray",
              }}
            >
              {" "}
              Saldo mês anterior R$:{receitasRecebidasMesAnterior} -
            </div>
            <div
              style={{
                border: "1px solid gray",
              }}
            >
              {" "}
              Saldo mês atual R$ : {receitasRecebidasMes}
            </div>
          </>
        );
      case "tudo":
        return <></>;
    }
  };

  return (
    <>
      <div>{handleTotalChange()}</div>
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
      <CriarReceitaModal onSuccess={fetchReceitas} />
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
              Tem certeza que deseja marcar esta receita como{" "}
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
          <ModalHeader>Excluir Receita</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Tem certeza que deseja excluir essa receita?</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleDeleteRevenue}>
              Salvar
            </Button>
            <Button onClick={onCloseDeleteModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
