import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useConfig } from "../../../context/ConfigContext";
import ChatIcon from "@mui/icons-material/Chat";
import styles from "./ClientChat.module.css";
import RemoveIcon from "@mui/icons-material/Remove";
import { useChat } from "../../../context/ChatContext";

const socket = io("http://localhost:3002", {
  transports: ["websocket", "polling"],
});

const ClientChat = ({ userName }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const storeID = Cookies.get("storeID");
  const userID = Cookies.get("UserID");
  const { apiUrl } = useConfig();
  const [openChat, setOpenChat] = useState(false);
  const [isSending, setIsSending] = useState(false); // Estado para controlar o envio
  const { fetchMessages } = useChat(); // Usando o contexto

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/messages/${storeID}/user/${userID}`
        );
        const messages = await response.json();

        const formattedMessages = messages.map((msg) => ({
          from: msg.from || "Unknown",
          message: msg.message || "",
          attendant: msg.attendant
        }));

        setChat(formattedMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    fetchMessages();

    // Listen for messages from the admin
    socket.on("adminMessage", (adminMessage) => {
      setChat((prevChat) => [
        ...prevChat,
        { from: "Admin", message: adminMessage.message || "" },
      ]);
    });

    // Listen for messages from other clients (including current user)
    socket.on("clientMessage", (clientMessage) => {
      // Verifica se a mensagem já está no chat
      if (
        clientMessage.from !== userName &&
        !chat.some((msg) => msg.message === clientMessage.message && msg.from === clientMessage.from)
      ) {
        setChat((prevChat) => [
          ...prevChat,
          { from: clientMessage.from, message: clientMessage.message },
        ]);
      }
    });

    return () => {
      socket.off("adminMessage");
      socket.off("clientMessage");
    };
  }, [storeID, userID, apiUrl, userName, chat]); // Adicionando chat como dependência

  const sendMessage = async () => {
    if (message.trim() && !isSending) { // Adicionando controle para envio
      setIsSending(true); // Desativa o botão de envio
      socket.emit("clientMessage", {
        from: userName,
        message: message,
      });

      // Adiciona a mensagem do cliente ao chat localmente
      setChat((prevChat) => [
        ...prevChat,
        { from: userName, message: message },
      ]);

      // Salva a mensagem no banco de dados
      try {
        const response = await fetch(`${apiUrl}/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: userName,
            message: message,
            storeID: storeID,
            userID: userID,
          }),
        });

        if (!response.ok) {
          throw new Error("Error saving message");
        }
        fetchMessages(); // Chama a função fetchMessages do contexto

      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsSending(false); // Reativa o botão de envio
        setMessage(""); // Limpa o campo de entrada após enviar
      }
    }
  };

  return (
    <div className={styles.Container}>
      <div onClick={() => setOpenChat(!openChat)} className={styles.ChatIcon}>
        <ChatIcon />
      </div>
      {openChat && (
        <div className={styles.ChatBox}>
          <RemoveIcon
            onClick={() => setOpenChat(!openChat)}
            style={{ marginTop: "25rem" }}
          />
          <div
            style={{
              border: "1px solid #ccc",
              height: "300px",
              overflowY: "scroll",
            }}
          >
            {chat.map((msg, idx) => (
              <div key={idx} className={msg.from != 'admin' ? styles.user : styles.admin }>
                <strong>{msg.attendant ? msg.attendant : msg.from}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} disabled={isSending}>Send</button> {/* Desativando o botão se estiver enviando */}
        </div>
      )}
    </div>
  );
};

export default ClientChat;
