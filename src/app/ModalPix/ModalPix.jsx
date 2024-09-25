import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, useDisclosure } from '@chakra-ui/react';
import Cookies from "js-cookie";
import axios from 'axios';
import { useConfig } from '../../../context/ConfigContext';

export default function InitialFocus() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [pixKey, setPixKey] = useState("");
  const [qrcode, setQrcode] = useState("");

  const { apiUrl } = useConfig();
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie

  async function handleCreateQRcode() {
    if (!pixKey) {
      alert('Chave Pix é obrigatória!');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/ecommerce/admin/qrcode`, {
        pixKey,
        adminID: AdminID,
      });
      setQrcode(response.data.qrCodeUrl);
      console.log("qrcode", response.data.qrCodeUrl);
    } catch (error) {
      console.error("Error creating QR code:", error);
      setQrcode(null);
    }
  }

  return (
    <>
      <Button onClick={onOpen}>Cadastrar Chave Pix</Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crie um QRcode</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Chave Pix</FormLabel>
              <Input
                ref={initialRef}
                placeholder='chave pix...'
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreateQRcode}>
              Salvar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
