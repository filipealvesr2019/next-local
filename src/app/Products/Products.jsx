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

import CreateProductsModal from "../components/CreateProducts/CreateProductsModal/CreateProductsModal";
import Link from "next/link";
import { useConfig } from "../../../context/ConfigContext";
export default function Products() {
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
      const response = await axios.get(`${apiUrl}/api/products/${AdminID}`);
      setData(response.data || []);
      console.log("getProducts", response.data);
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

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/api/product/${deleteProduct._id}`)
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
          <CreateProductsModal  onSuccess={fetchProducts} />
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
                  <Th>Produto</Th>
                  <Th>Nome</Th>
                  <Th>Preço Por Unidade</Th>
                  <Th>Excluir</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.length > 0 ? (
                  data.map((product) => (
                    <Tr>
                      <Td>
                        <Link href={`/admin-product/${product.name}/${product._id}`}>
                          <div key={product._id}>
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              style={{ width: "15vw" }}
                            />
                          </div>
                        </Link>
                      </Td>
                      <Td>{product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name}
                      </Td>
                      <Td>R${product.price}</Td>
                     
                      <Td style={{ color: "#C0392B", cursor: "pointer" }}    onClick={() => openDeleteModal(product._id)}>
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
