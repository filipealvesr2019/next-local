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


import { useConfig } from "../../../../context/ConfigContext";
import HorarioModal from "./Modal/HorarioModal";
export default function Horario() {
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
      const response = await axios.get(`${apiUrl}/api/admin/horario-funcionamento/${AdminID}`);
      setData(response.data.horarioFuncionamento || []);
      console.log("HorarioModal", response.data.horarioFuncionamento
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
      const response = await axios.delete(`${apiUrl}/api/admin/horario-funcionamento/${AdminID}`)
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
          <HorarioModal  onSuccess={fetchProducts} />
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
                  <Th>Abertura</Th>
                  <Th>Fechamento</Th>
                  <Th>Excluir</Th>
                </Tr>
              </Thead>
              <Tbody>
         
            
                    <Tr>
                    
                      <Td>{data.abertura}
                      </Td>
                      <Td>{data.fechamento}</Td>
                     
                      <Td style={{ color: "#C0392B", cursor: "pointer" }}    onClick={() => openDeleteModal()}>
                       {data.length < 0 ? "": <DeleteIcon /> } 
                      </Td>
                    </Tr>
             
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
