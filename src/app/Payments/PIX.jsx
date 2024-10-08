import axios from "axios";
import React, { useEffect, useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { Radio, RadioGroup, Stack } from '@chakra-ui/react'
import Cookies from "js-cookie";
import ModalPix from "../components/ModalPix/ModalPix";
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
  const [qrcode, setQrcode] = useState([]); // Armazena todos os QR codes
  const [selectedPixKey, setSelectedPixKey] = useState(null); // Pix selecionado
  const { apiUrl } = useConfig();
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie
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
  const [deleteQRCode, setDeleteQRCode] = useState(null);


  const openStatusModal = (revenue) => {
    setSelectedRevenue(revenue);
    setNewStatus(revenue.status === "PENDING" ? "RECEIVED" : "PENDING");
    onOpenStatusModal();
  };

  const openDeleteModal = (id) => {
    setDeleteQRCode({ _id: id });  // Certifique-se de passar apenas o _id
    onOpenDeleteModal();
  };
  
  // Função para buscar o PixKey selecionado no Ecommerce e os QR Codes
  useEffect(() => {
    async function getPixData() {
      try {
        // Buscar QR Codes do admin
        const pixResponse = await axios.get(`${apiUrl}/api/admin/pix-keys/${AdminID}`);
        setQrcode(pixResponse.data);
         
        // Buscar o ecommerce com o PixKey selecionado
        const ecommerceResponse = await axios.get(`${apiUrl}/api/pix/admin/${AdminID}`);
        setSelectedPixKey(ecommerceResponse.data.pixKey); // Define o PixKey selecionado

      } catch (error) {
        console.error("Error fetching pix keys or ecommerce data:", error);
        setQrcode([]);
      }
    }
    getPixData();
  }, [AdminID, apiUrl]);

  // Função para selecionar e salvar o PixKey escolhido
  const handlePixSelection = async (pix) => {
    try {
      setSelectedPixKey(pix.pixKey); // Define o PixKey selecionado no estado

      // Atualiza o ecommerce com o PixKey e QR Code selecionados
      await axios.put(`${apiUrl}/api/ecommerce/update-pix/${AdminID}`, {
        pixKey: pix.pixKey,
        qrCodeUrl: pix.qrCodeUrl
      });

      alert("Pix selecionado e salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar a chave Pix:", error);
    }
  };



  const handleDeleteQRCode = async (id) => {
    try {
      await axios.delete(
        `${apiUrl}/api/admin/pix-keys/${deleteQRCode._id}`
      );
      
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  return (
    <>
      <TableContainer
        style={{
          border: "1px solid #edf2f7",
          borderRadius: "10px",
          marginTop: "10rem",
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
                          value={pix.pixKey} // O valor é o pixKey
                          onChange={() => handlePixSelection(pix)} // Seleciona o Pix
                          isChecked={pix.pixKey === selectedPixKey} // Verifica se está selecionado
                        >
                       {pix.pixKey === selectedPixKey ? 'Selecionado' : 'Escolher?'}    
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
                    onClick={() => openDeleteModal(pix._id)}

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
      
      {/* Modal para confirmar a alteração de status */}
      <Modal
        // closeOnOverlayClick={false}
        // isOpen={isStatusModalOpen}
        // onClose={onCloseStatusModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              Tem certeza que deseja marcar esta receita como{" "}
              <b></b>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} >
              Salvar
            </Button>
            {/* <Button onClick={onCloseStatusModal}>Cancelar</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para confirmar a exclusão de despesa */}
      <Modal
       isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Excluir QRCode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Tem certeza que deseja excluir esse QRCode?</p>
          </ModalBody>
          <ModalFooter onClick={handleDeleteQRCode}>
            <Button colorScheme="blue" mr={3} >
              Salvar
            </Button>
            <Button onClick={onCloseDeleteModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
