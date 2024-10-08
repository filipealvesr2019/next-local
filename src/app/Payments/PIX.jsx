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
  const AdminID = Cookies.get("AdminID");
  const {
    isOpen: isSelectModalOpen,
    onOpen: onOpenSelectModal,
    onClose: onCloseSelectModal,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();
  const [deleteQRCode, setDeleteQRCode] = useState(null);
  const [tempSelectedPixKey, setTempSelectedPixKey] = useState(null); // Para armazenar o Pix temporariamente

  const openSelectModal = (pix) => {
    setTempSelectedPixKey(pix); // Armazena temporariamente a chave Pix
    onOpenSelectModal();
  };

  const openDeleteModal = (id) => {
    setDeleteQRCode({ _id: id });
    onOpenDeleteModal();
  };

  const fetchQRCode = async () => {
    await getPixData();
  };

  const getPixData = async () => {
    try {
      const pixResponse = await axios.get(`${apiUrl}/api/admin/pix-keys/${AdminID}`);
      setQrcode(pixResponse.data);

      const ecommerceResponse = await axios.get(`${apiUrl}/api/pix/admin/${AdminID}`);
      setSelectedPixKey(ecommerceResponse.data.pixKey);
    } catch (error) {
      console.error("Error fetching pix keys or ecommerce data:", error);
      setQrcode([]);
    }
  };

  useEffect(() => {
    getPixData();
  }, [AdminID, apiUrl]);

  const handlePixSelection = async (pix) => {
    try {
      setSelectedPixKey(pix.pixKey);

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
      setQrcode((prevQrcodes) => prevQrcodes.filter((pix) => pix._id !== deleteQRCode._id));
      onCloseDeleteModal();
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
           maxHeight: '400px',
        overflowY: 'auto'
        }}
      >
        <ModalPix onSuccess={fetchQRCode} />
        <Table variant="simple" style={{ backgroundColor: "white", }}>
          <Thead>
            <Tr>
              <Th>Escolha um QR Code</Th>
              <Th>QR Code</Th>
              <Th>Chave Pix</Th>
              <Th>Baixar QR Code</Th>
              <Th>Excluir</Th>
            </Tr>
          </Thead>
          <Tbody >
            {qrcode.length > 0 ? (
              qrcode.map((pix) => (
                <Tr key={pix._id}>
                  <Td>
                    <RadioGroup value={selectedPixKey}>
                      <Stack direction="row">
                        <Radio
                          value={pix.pixKey}
                          onChange={() => openSelectModal(pix)} // Abre o modal ao selecionar
                          isChecked={pix.pixKey === selectedPixKey}
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
      
      {/* Modal para confirmar a alteração de QRCode */}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isSelectModalOpen}
        onClose={onCloseSelectModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar QRCode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              Esse QR Code será escolhido como QR Code Principal de Pagamentos?{" "}
              <b></b>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => {
                handlePixSelection(tempSelectedPixKey); // Salva a seleção
                onCloseSelectModal(); // Fecha o modal
            }}>
              Salvar
            </Button>
            <Button onClick={onCloseSelectModal}>Cancelar</Button>
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
            <Button colorScheme="blue" mr={3}>
              Salvar
            </Button>
            <Button onClick={onCloseDeleteModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
