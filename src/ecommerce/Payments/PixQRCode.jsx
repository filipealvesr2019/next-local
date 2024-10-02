import { useEffect, useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import axios from "axios";
import { useAtom } from "jotai";
import { storeID } from "../../../store/store";
import Cookies from "js-cookie";

export default function PixQRCode() {
  const [qrcode, setQrcode] = useState(null);
  const { apiUrl } = useConfig();
  const [ecommerceID, setEcommerceID] = useAtom(storeID);

  useEffect(() => {
    async function getPix(id) {
      if (!id) return; // Evitar chamadas desnecessárias

      try {
        const response = await axios.get(`${apiUrl}/api/pix/ecommerce/${id}/qrcode`);
        setQrcode(response.data);
        console.log("qrcode", response.data);
      } catch (error) {
        console.error("Error fetching QR Code:", error);
        setQrcode(null);
      }
    }

    if (ecommerceID) {
      getPix(ecommerceID); // Chama a função com o ID correto
    }
  }, [ecommerceID, apiUrl]);

  useEffect(() => {
    const savedStoreID = Cookies.get("storeID");

    if (savedStoreID) {
      setEcommerceID(savedStoreID); // Atualiza o Atom com o storeID salvo no cookie
      console.log("storeID recuperado dos cookies:", savedStoreID);
    } else if (ecommerceID) {
      console.log("storeID do Atom:", ecommerceID);
    } else {
      console.log("storeID não disponível");
      setQrcode(null); // Limpa o QR code se o storeID não estiver disponível
    }
  }, [ecommerceID, setEcommerceID]);

  return (
    <>
      {qrcode ? (
        <>
          <img src={qrcode.qrCodeUrl} alt="QR Code" />
          <span>{qrcode.pixKey}</span>
        </>
      ) : (
        <p>QR Code não disponível.</p>
      )}
    </>
  );
}
