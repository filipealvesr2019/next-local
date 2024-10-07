import axios from "axios";
import { useEffect, useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import DeleteIcon from "@mui/icons-material/Delete";

import Cookies from "js-cookie";
import ModalPix from "../components/ModalPix/ModalPix";
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
} from "@chakra-ui/react";

export default function PIX() {
  const [qrcode, setQrcode] = useState([]);

  const { apiUrl } = useConfig();
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie
  useEffect(() => {
    async function getPix() {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/pix-keys/${AdminID}`);
        setQrcode(response.data);
        console.log("qrcode", response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setQrcode(null);
      }
    }

    getPix();
  }, []);

  return (
    <>

      <TableContainer
        style={{
          border: "1px solid #edf2f7",
          borderRadius: "10px",
          marginTop:"15rem",
        }}
      >
              <ModalPix />
        <Table variant="simple" style={{
                    backgroundColor:"white"

        }}>
          <Thead>
            <Tr>
              <Th>QR Code</Th>
              <Th>Chave Pix</Th>
              <Th>Baixar QR Code</Th>
              <Th>Excluir</Th>
            </Tr>
          </Thead>
          <Tbody>
            {qrcode && (
qrcode.map((pix) => (
  <>
    <>
                <Tr>
                  <Td>
                    <img src={pix.qrCodeUrl} alt="" />
                  </Td>
                  <Td>
                    <span>{pix.pixKey}</span>
                  </Td>

                  <Td>
                  
                  <a
                    href={pix.qrCodeUrl}
                    download="qrcode_pix.png" // Nome do arquivo a ser baixado
                    style={{ width: "300px", height: "300px" }} // Aumenta o tamanho na tela

                  >
                    <button>Baixar QR Code</button>
                  </a>
                </Td>
         
                  <Td
                    style={{
                      color: "#C0392B",
                      cursor: "pointer",
                    }}
                    onClick={() => openDeleteModal(revenue)}
                  >
                    <DeleteIcon />
                  </Td>
                </Tr>
              </>
  </>
))
            
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
