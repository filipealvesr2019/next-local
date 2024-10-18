import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useConfig } from "../../../../context/ConfigContext";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./AdminChat.module.css";
const socket = io("http://localhost:3002", {
  transports: ["websocket", "polling"],
});

const AdminChat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const userID = Cookies.get("UserID");
  const { apiUrl } = useConfig();
  const AdminID = Cookies.get("AdminID");
  const [storeID, setStoreID] = useState(null);

  useEffect(() => {
    const handleGetEcommerce = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/loja/admin/${AdminID}`);
        const retrievedStoreID = response.data._id;
        setStoreID(retrievedStoreID);
      } catch (error) {
        console.error("Erro ao buscar a loja:", error);
      }
    };

    if (AdminID) {
      handleGetEcommerce();
    }
  }, [AdminID]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/messages/${storeID}`);
        const messages = await response.json();
        if (Array.isArray(messages)) {
          setChat(messages);
          console.log("messages", messages);
        } else {
          console.error("A resposta não é um array:", messages);
          setChat([]); // Se não for um array, defina chat como um array vazio
        }
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    };

    if (storeID) {
      fetchMessages();
    }

    socket.on("adminMessage", (adminMessage) => {
      // Quando uma nova mensagem do admin chega, verifique se é para o usuário selecionado
      if (selectedUser) {
        setChat((prevChat) => [
          ...prevChat,
          { from: "Admin", message: adminMessage, userID: selectedUser },
        ]);
      }
    });

    return () => {
      socket.off("adminMessage");
    };
  }, [storeID, selectedUser]); // Adiciona selectedUser como dependência

  const sendMessage = async () => {
    if (message.trim() && selectedUser) {
      // Verifica se um usuário está selecionado
      const messageObject = { from: "You", message, userID: selectedUser };

      // Envia a mensagem pelo socket
      socket.emit("clientMessage", message); // Envia mensagem pelo socket
      setChat((prevChat) => [...prevChat, messageObject]); // Adiciona a mensagem ao chat

      try {
        const response = await fetch(`${apiUrl}/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "admin",
            message: message,
            storeID: storeID,
            userID: selectedUser, // Usa o selectedUser para associar a mensagem
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao salvar a mensagem");
        }
      } catch (error) {
        console.error("Erro ao enviar a mensagem:", error);
      }

      setMessage("");
    } else {
      console.error("Selecione um usuário antes de enviar uma mensagem."); // Mensagem de erro se não houver usuário selecionado
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  // Filtra mensagens com base no usuário selecionado
  const filteredMessages = selectedUser
    ? chat.filter((msg) => msg.userID === selectedUser) // Filtra mensagens do usuário selecionado
    : ""; // Mostra todas as mensagens se nenhum usuário estiver selecionado

  return (
    <div className={styles.Container}>
      {/* Coluna da esquerda */}
      <div className={styles.UsersList}>
        <h3>Usuários</h3>
        {Array.from(new Set(chat.map((msg) => msg.userID))).map((user, idx) => {
          // Encontre o primeiro nome correspondente ao userID
          const userMsg = chat.find((msg) => msg.userID === user);
          const userName = userMsg ? userMsg.from : "Usuário Desconhecido"; // Define um nome padrão caso não encontre

          return (
            <div
              key={idx}
              onClick={() => handleUserClick(user)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AccountCircleIcon />
              <span>{userName}</span> {/* Use userName aqui */}
            </div>
          );
        })}
      </div>

      {/* Coluna da direita */}
      <div className={styles.messageContainer}>
        <div className={styles.messageContent}>
          {Array.isArray(filteredMessages) &&
            filteredMessages.map((msg, idx) => (
              <div key={idx}>
                <strong>{msg.from}:</strong> {msg.message}{" "}
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                  : ""}
              </div>
            ))}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <button onClick={sendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
