import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useConfig } from "../../../context/ConfigContext";
import ChatIcon from "@mui/icons-material/Chat";
import styles from "./ClientChat.module.css";
import RemoveIcon from '@mui/icons-material/Remove';
const socket = io("http://localhost:3002", {
  transports: ["websocket", "polling"],
});

const ClientChat = ({ userName }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const storeID = Cookies.get("storeID"); // Obtenha o ID da loja do cookie
  const userID = Cookies.get("UserID"); // Obtenha o ID do cliente do cookie
  const { apiUrl } = useConfig();
  const [openChat, setOpenChat] = useState(false);
  useEffect(() => {
    // Função para buscar mensagens do banco de dados
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/messages/${storeID}/user/${userID}`
        );
        const messages = await response.json();
        console.log(messages);
        setChat(messages);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    };

    // Buscar mensagens ao montar o componente
    fetchMessages();

    socket.on("adminMessage", (adminMessage) => {
      setChat((prevChat) => [
        ...prevChat,
        { from: "Admin", text: adminMessage },
      ]);
    });

    return () => {
      socket.off("adminMessage");
    };
  }, [storeID, userID]);

  const sendMessage = async () => {
    if (message.trim()) {
      socket.emit("clientMessage", message); // Enviar mensagem para o admin
      setChat((prevChat) => [...prevChat, { from: "You", text: message }]);

      // Salvar mensagem no banco de dados
      try {
        const response = await fetch(`${apiUrl}/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: userName, // ou use um nome mais identificável
            message: message,
            storeID: storeID,
            userID: userID,
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao salvar a mensagem");
        }
      } catch (error) {
        console.error("Erro ao enviar a mensagem:", error);
      }

      setMessage(""); // Limpar campo de mensagem
    }
  };

  return (
    <div className={styles.Container}>
      <div onClick={() => setOpenChat(!openChat)} className={styles.ChatIcon}>
        <ChatIcon />
      </div>
      {openChat ? (
        <div className={styles.ChatIcon}>
          <RemoveIcon onClick={() => setOpenChat(!openChat)} style={{
            marginTop:"25rem"
          }}/>
          <div
            style={{
              border: "1px solid #ccc",
              height: "300px",
              overflowY: "scroll",
            }}
          >
            {chat.map((msg, idx) => (
              <div key={idx}>
                <strong>{msg.from}:</strong> {msg.message}{" "}
                {/* Corrigido para usar 'message' */}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <button onClick={sendMessage}>Enviar</button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ClientChat;