import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import styles from "./Sales.module.css";
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
} from '@chakra-ui/react';


import Cookies from "js-cookie";
import { useConfig } from "../../../../context/ConfigContext";
import Link from "next/link";

export default function Sales({ storeID }) {
  const { apiUrl } = useConfig();
  const [data, setData] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null); // Armazena a venda selecionada para alterar o status
  const { isOpen, onOpen, onClose } = useDisclosure();
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie

  // Função para buscar as vendas
  async function getProducts() {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/vendas/${storeID}`);
      setData(response.data || []);
      console.log('vendas', response.data )
    } catch (error) {
      console.error("Error fetching products:", error);
      setData([]);
    }
  }

  useEffect(() => {
    if (storeID) {
      getProducts();
    }
  }, [storeID]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Função para abrir o modal e selecionar a venda
  const openSaleModal = (sale) => {
    setSelectedSale(sale); // Define a venda selecionada
    onOpen(); // Abre o modal
  };

  // Função para salvar a alteração de status
  const handleSaveStatus = async () => {
    if (selectedSale) {
      try {
        const updatedStatus = selectedSale.status === "RECEIVED" ? "PENDING" : "RECEIVED";
        const response = await axios.put(`${apiUrl}/api/compras/${selectedSale._id}/status`, { status: updatedStatus,         adminID: AdminID // Adiciona adminID na requisição
        });
        
        // Atualiza o estado local com o novo status
        setData((prevData) =>
          prevData.map((item) =>
            item._id === selectedSale._id ? { ...item, status: updatedStatus } : item
          )
        );
        
        // Fecha o modal após a atualização
        onClose();
      } catch (error) {
        console.error("Error updating sale status:", error);
      }
    }
  };

  return (
    <div>
      {data.length > 0 ? (
        <TableContainer className={styles.TableContainer}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Produto</Th>
                <Th>Data</Th>
                <Th>Status</Th>
                <Th isNumeric>Preço</Th>
              </Tr>
            </Thead>
            <Tbody className={styles.Tbody}>
              {data.map((product) => (
                <Tr key={product._id}>
                  <Td>
                    <Link href={`/admin/sales/${product._id}`}>
                      <img
                        src={product.items[0].imageUrl}
                        alt={product.name}
                        style={{ width: "15vw" }}
                      />
                    </Link>
                  </Td>
                 
                  <Td>{formatDate(product.purchaseDate)}</Td>
                  <Td
                    className={product.status === "RECEIVED" ? styles.received : styles.pending}
                    onClick={() => openSaleModal(product)} // Abre o modal ao clicar no status
                  >
                    {product.status === "RECEIVED" ? "PAGO" : "PENDENTE"}
                  </Td>
                  <Td isNumeric>
                    <Link href={`/admin/sales/${product._id}`}>
                      R${product.totalAmount}
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <p>No products available</p>
      )}

      {/* Modal para confirmar a alteração de status */}
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Marcar venda</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <p>Tem certeza que quer marcar essa venda como <b>{selectedSale?.status === "RECEIVED" ? "pendente" : "paga"}</b> ?</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSaveStatus}>
              Salvar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
