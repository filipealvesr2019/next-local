import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useConfig } from "../../../../context/ConfigContext";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./AdminChat.module.css";
import { useChat } from "../../../../context/ChatContext";

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
  const [unreadCounts, setUnreadCounts] = useState({});
  const { setFetchMessages } = useChat(); // Usando o contexto

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
          // Inicializa a contagem de mensagens não lidas apenas para mensagens do cliente
          const counts = messages.reduce((acc, msg) => {
            if (msg.from !== "admin") {
              // Conta apenas as mensagens não enviadas pelo admin
              acc[msg.userID] = (acc[msg.userID] || 0) + (msg.read ? 0 : 1);
            }
            return acc;
          }, {});
          setUnreadCounts(counts);
          setFetchMessages(fetchMessages); // Atualiza a função fetchMessages no contexto
        } else {
          console.error("A resposta não é um array:", messages);
          setChat([]);
        }
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    };

    if (storeID) {
      fetchMessages();
    }
    socket.on("adminMessage", (adminMessage) => {
      if (selectedUser) {
        setChat((prevChat) => {
          // Evita mensagens duplicadas
          const isDuplicate = prevChat.some(
            (msg) =>
              msg.message === adminMessage.message &&
              msg.userID === adminMessage.userID
          );
          if (!isDuplicate) {
            return [
              ...prevChat,
              {
                from: "Admin",
                message: adminMessage.message,
                userID: selectedUser,
                read: false,
              },
            ];
          }
          return prevChat;
        });

        // As mensagens enviadas pelo admin não atualizam a contagem de não lidas
      }
    });

    return () => {
      socket.off("adminMessage");
    };
  }, [storeID, selectedUser]);

  const sendMessage = async () => {
    if (message.trim() && selectedUser) {
      const messageObject = { from: "Você", message, userID: selectedUser };

      // Envia a mensagem pelo socket
      socket.emit("clientMessage", { message, userID: selectedUser });

      // Atualiza o estado local
      setChat((prevChat) => [...prevChat, messageObject]);

      try {
        // Salva a mensagem no backend
        const response = await fetch(`${apiUrl}/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attendant: `maria (atendente)`,
            from: "admin",
            message,
            storeID,
            userID: selectedUser,
            read: false,
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
      console.error("Selecione um usuário antes de enviar uma mensagem.");
    }
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);

    try {
      const response = await axios.patch(
        `${apiUrl}/api/messages/read/${user}/${storeID}`
      );
      const { unreadCount } = response.data;

      // Marque as mensagens como lidas no estado local
      setChat((prevChat) =>
        prevChat.map((msg) =>
          msg.userID === user ? { ...msg, read: true } : msg
        )
      );

      // Atualiza a contagem de mensagens não lidas
      setUnreadCounts((prev) => ({ ...prev, [user]: unreadCount }));
    } catch (error) {
      console.error("Erro ao atualizar mensagens:", error);
    }
  };

  const filteredMessages = selectedUser
    ? chat.filter((msg) => msg.userID === selectedUser)
    : [];

  return (
    <div className={styles.Container}>
      <div className={styles.UsersList}>
        <h3>Usuários</h3>
        {Array.from(new Set(chat.map((msg) => msg.userID))).map((user, idx) => {
          const userMsg = chat.find((msg) => msg.userID === user);
          const userName = userMsg ? userMsg.from : "Usuário Desconhecido";
          const unreadCount = unreadCounts[user] || 0;

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
              <div >
                {userName} 
                
                <span className={unreadCount > 0 ? styles.span :  ''}>

                {unreadCount > 0 && `${unreadCount}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.messageContainer}>
        <div className={styles.messageContent}>
          {Array.isArray(filteredMessages) &&
            filteredMessages.map((msg, idx) => (
              <div key={idx} className={msg.from != 'admin' ? styles.user : styles.admin }>
                <strong>{msg.from}:</strong>{" "}
                {msg.message ? msg.message : "Mensagem inválida"}{" "}
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
