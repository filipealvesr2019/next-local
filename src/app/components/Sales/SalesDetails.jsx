"use client";
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
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useConfig } from "../../../../context/ConfigContext";

export default function SalesDetails({ id }) {
  const { apiUrl } = useConfig();
  const [data, setData] = useState(null); // Alterado para null
  const { isOpen, onOpen, onClose } = useDisclosure();
  const AdminID = Cookies.get("AdminID");

  // Função para buscar os produtos
  async function getProducts() {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/order/${id}`);
      setData(response.data || {}); // Alterado para objeto
      console.log("vendas", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setData(null); // Mudei para null se houver erro
    }
  }

  useEffect(() => {
    if (id) {
      getProducts();
    }
  }, [id]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      {data ? (
        <TableContainer className={styles.TableContainer}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Produto</Th>
                <Th>Nome</Th>
                <Th>Data</Th>
                <Th>Status</Th>
                <Th isNumeric>Preço</Th>
              </Tr>
            </Thead>
            <Tbody className={styles.Tbody}>
              {data.items && data.items.length > 0 ? (
                data.items.map((item) => (
                  <Tr key={item._id}>
                    <Td>
                      <img src={item.imageUrl} alt={item.name} style={{ width: '50px', height: '50px' }} />
                    </Td>
                    <Td>{item.name}</Td>
                    <Td>{formatDate(data.purchaseDate)}</Td>
                    <Td>{data.status}</Td>
                    <Td isNumeric>{item.price.toFixed(2)}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={5}>Nenhum produto encontrado para este pedido.</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <p>Nenhum produto encontrado para este pedido.</p>
      )}
    </div>
  );
}
