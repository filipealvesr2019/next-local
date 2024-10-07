import axios from "axios";
import React, { useEffect, useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { Radio, RadioGroup, Stack } from '@chakra-ui/react'
import Cookies from "js-cookie";
import ModalPix from "../components/ModalPix/ModalPix";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

export default function PIX() {
  const [qrcode, setQrcode] = useState([]);
  const [selectedPixKey, setSelectedPixKey] = useState(null); // Para armazenar a chave Pix selecionada
  const { apiUrl } = useConfig();
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie

  useEffect(() => {
    async function getPix() {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/pix-keys/${AdminID}`);
        setQrcode(response.data);
      } catch (error) {
        console.error("Error fetching pix keys:", error);
        setQrcode([]);
      }
    }
    getPix();
  }, []);

  const handlePixSelection = async (pix) => {
    try {
      setSelectedPixKey(pix.pixKey); // Define a chave Pix selecionada

      // Atualiza o ecommerce com a chave Pix e QR Code selecionado
      await axios.put(`${apiUrl}/api/ecommerce/update-pix/${AdminID}`, {
        pixKey: pix.pixKey,
        qrCodeUrl: pix.qrCodeUrl
      });
      
      alert("Pix selecionado e salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar a chave Pix:", error);
    }
  };

  return (
    <>
      <TableContainer
        style={{
          border: "1px solid #edf2f7",
          borderRadius: "10px",
          marginTop: "15rem",
        }}
      >
        <ModalPix />
        <Table variant="simple" style={{ backgroundColor: "white" }}>
          <Thead>
            <Tr>
              <Th>Escolha um QR Code</Th>
              <Th>QR Code</Th>
              <Th>Chave Pix</Th>
              <Th>Baixar QR Code</Th>
              <Th>Excluir</Th>
            </Tr>
          </Thead>
          <Tbody>
            {qrcode.length > 0 ? (
              qrcode.map((pix) => (
                <Tr key={pix._id}>
                  <Td>
                    <RadioGroup value={selectedPixKey}>
                      <Stack direction="row">
                        <Radio
                          value={pix.pixKey}
                          onChange={() => handlePixSelection(pix)}
                        >
                          Selecionar
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </Td>
                  <Td>
                    <img src={pix.qrCodeUrl} alt="QR Code" />
                  </Td>
                  <Td>
                    <span>{pix.pixKey}</span>
                  </Td>
                  <Td>
                    <a href={pix.qrCodeUrl} download="qrcode_pix.png">
                      <button>Baixar QR Code</button>
                    </a>
                  </Td>
                  <Td
                    style={{ color: "#C0392B", cursor: "pointer" }}
                    onClick={() => console.log("Delete action")} // Implemente sua lógica de exclusão aqui
                  >
                    <DeleteIcon />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="5">Nenhum QR Code encontrado</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
