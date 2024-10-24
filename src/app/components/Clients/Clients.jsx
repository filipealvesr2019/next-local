import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

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
} from "@chakra-ui/react";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateClientModal from "./CreateClientModal/CreateClientModal";

export default function Clients() {
  const [atendentes, setAtendentes] = useState([]);
  const AdminID = Cookies.get("AdminID");
  const fetchAtendentesRender = async () =>{
    await fetchAtendentes();
}
// Faz a requisição para obter os atendentes do adminID
const fetchAtendentes = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3002/api/atendentes/${AdminID}`
    );
    if (response.data.success) {
      setAtendentes(response.data.atendentes);
    }
  } catch (error) {
    console.error("Erro ao buscar atendentes:", error);
  }
};

  useEffect(() => {
   
    fetchAtendentes();
  }, [AdminID]);

  return (
    <div>
      <h1>Atendentes</h1>
      {/* {atendentes.length > 0 ? (
        <ul>
          {atendentes.map((atendente) => (
            <li key={atendente._id}>
              <p>Email: {atendente.email}</p>
              <p>Componentes:</p>
              <ul>
                {atendente.components.map((component, index) => (
                  <li key={index}>
                    {component.name} -{" "}
                    {component.enabled ? "Ativado" : "Desativado"}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum atendente encontrado.</p>
      )} */}
      <CreateClientModal onSuccess={fetchAtendentesRender}/>
      <TableContainer
        style={{
          border: "1px solid #edf2f7",
          borderRadius: "10px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <Table variant="simple" style={{ backgroundColor: "white" }}>
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Email</Th>

              <Th>Excluir</Th>
            </Tr>
          </Thead>
          {atendentes.length > 0 ? (
            <Tbody>
              {atendentes.map((atendente) => (
                <Tr key={atendente._id}>
                  <>
                    <Td>{atendente.name}</Td>

                    <Td>{atendente.email}</Td>

                    <Td style={{ color: "#C0392B", cursor: "pointer" }}>
                      <DeleteIcon />
                    </Td>
                  </>
                </Tr>
              ))}
            </Tbody>
          ) : (
            <p>Nenhum atendente encontrado.</p>
          )}
        </Table>
      </TableContainer>
    </div>
  );
}
