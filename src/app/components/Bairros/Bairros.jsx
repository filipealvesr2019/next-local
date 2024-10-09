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
} from "@chakra-ui/react";
import DeleteIcon from "@mui/icons-material/Delete";

import Link from "next/link";
import BairrosModal from "./Modal/BairrosModal";
import { useConfig } from "../../../../context/ConfigContext";
export default function Bairros() {
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie

  const { apiUrl } = useConfig();
  const [data, setData] = useState([]);
  const [deleteProduct, setDeleteProduct] = useState([]);

  
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  
  const fetchProducts = async () => {
    await getProducts();
 
  };
  // console.log("adminEccommerceID", adminEccommerceID)
  async function getProducts() {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/bairros/${AdminID}`);
      setData(response.data.bairros || []);
      console.log("bairros", response.data.bairros
      );
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
      const response = await axios.delete(`${apiUrl}/api/admin/bairros/${AdminID}/${deleteProduct._id}`)
      await  getProducts();
    } catch (error){
      console.log(error)
    }
  }
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
          <BairrosModal  onSuccess={fetchProducts} />
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
                  <Th>Bairro</Th>
                  <Th>Cidade</Th>
                  <Th>Estado</Th>
                  <Th>Excluir</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.length > 0 ? (
                  data.map((bairro) => (
                    <Tr>
                        <Td>{bairro.bairro}
                        </Td>
                      <Td>{bairro.cidade}
                      </Td>
                      <Td>{bairro.estado}</Td>
                     
                      <Td style={{ color: "#C0392B", cursor: "pointer" }}    onClick={() => openDeleteModal(bairro._id)}>
                        <DeleteIcon />
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <p>No products available</p>
                )}
              </Tbody>
            </Table>
          </TableContainer>
          {/* Modal para confirmar a exclusão de despesa */}
      <Modal
       isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Excluir Produto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Tem certeza que deseja excluir esse Produto?</p>
          </ModalBody>
          <ModalFooter onClick={handleDeleteProduct} >
            <Button colorScheme="blue" mr={3} onClick={onCloseDeleteModal}>
              Salvar
            </Button>
            <Button onClick={onCloseDeleteModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </div>
      </div>
    </>
  );
}
