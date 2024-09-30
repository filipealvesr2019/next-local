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
  useDisclosure,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";

import CriarCategoriasModal from "./CriarCategoriasModal/CriarCategoriasModal";
import styles from "./Categorias.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { useConfig } from "../../../../../context/ConfigContext";
export default function Receitas() {
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie

  const { apiUrl } = useConfig();
  const [data, setData] = useState([]);
  const fetchReceitas = async () => {
    getCategories();

  };


  const [deleteCategory, setDeleteCategory] = useState(null);

  const openDeleteModal = (revenue) => {
    setDeleteCategory(revenue);
    onOpenDeleteModal();
  };
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  // console.log("adminEccommerceID", adminEccommerceID)
  async function getCategories() {
    try {
      const response = await axios.get(`${apiUrl}/api/categories/${AdminID}`);
      setData(response.data || []);
      console.log("getCategories", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setData([]);
    }
  }
  useEffect(() => {
    getCategories();
  }, []);

  const handleDeleteCategory = async () => {
    try {
      await axios.delete(
        `${apiUrl}/api/categorias/${AdminID}/${deleteCategory._id}`
      );
      // Atualize a lista de receitas após a alteração
      await getCategories();
    
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  return (
    <>
      <CriarCategoriasModal  onSuccess={fetchReceitas}/>
      {data.length > 0 ? (
        <TableContainer
          style={{
            border: "1px solid #edf2f7",
            borderRadius: "10px",
          }}
        >
          <Table variant="simple">
            <Thead>
              <Tr>
              <Th>Nome da Categoria</Th>
              <Th>Tipo</Th>
              <Th>Excluir</Th>

              </Tr>
            </Thead>
            <Tbody>
              {data.map((revenue) => (
                <Tr key={revenue._id}>
                  <Td>{revenue.name}</Td>
                  <Td className={revenue.type === "despesa" ? styles.typeDespesa : styles.typeReceita}>{revenue.type}</Td>
                 
                  <Td
                          style={{
                            color: "#C0392B",
                            cursor:"pointer"
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
        <p>No products available</p>
      )}
       {/* Modal para confirmar a exclusão de despesa */}
       <Modal
        closeOnOverlayClick={false}
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Excluir Categoria</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Tem certeza que deseja excluir essa Categoria?</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleDeleteCategory}>
              Salvar
            </Button>
            <Button onClick={onCloseDeleteModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
