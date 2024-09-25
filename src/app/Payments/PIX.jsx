import axios from "axios"
import { useEffect, useState } from "react"
import { useConfig } from "../../../context/ConfigContext";

import Cookies from "js-cookie";
import ModalPix from '../components/ModalPix/ModalPix'
export default function PIX(){
    const [qrcode, setQrcode] = useState("");

    const { apiUrl } = useConfig();
    const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie
    useEffect(() => {
        async function getPix() {
          try {
            
            const response = await axios.get(`${apiUrl}/api/pix/admin/${AdminID}`);
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
        <span style={{
            marginTop:"15rem"
        }}>
            <ModalPix />

            {qrcode && (
        <>
          {" "}
          <img src={qrcode.qrCodeUrl} alt="" />
          <span>{qrcode.pixKey}</span>
        </>
      )}
        </span>
        
        </>
    )
}