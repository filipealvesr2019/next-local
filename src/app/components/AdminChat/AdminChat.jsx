import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Cookies from "js-cookie";
import { useConfig } from '../../../../context/ConfigContext';
import axios from 'axios';

const socket = io('http://localhost:3002', {
  transports: ['websocket', 'polling'],
});

const AdminChat = () => {
  const [message, setMessage] = useState('');
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
        } else {
          console.error('A resposta não é um array:', messages);
          setChat([]); // Se não for um array, defina chat como um array vazio
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    };

    if (storeID) {
      fetchMessages();
    }

    socket.on('adminMessage', (adminMessage) => {
      setChat((prevChat) => [...prevChat, { from: 'Admin', message: adminMessage }]);
    });

    return () => {
      socket.off('adminMessage');
    };
  }, [storeID, userID]);

  const sendMessage = async () => {
    if (message.trim()) {
      socket.emit('clientMessage', message);
      setChat((prevChat) => [...prevChat, { from: 'You', message }]);

      try {
        const response = await fetch(`${apiUrl}/api/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'admin',
            message: message,
            storeID: storeID,
            userID: userID
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao salvar a mensagem');
        }
      } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
      }

      setMessage('');
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const filteredMessages = selectedUser
    ? chat.filter(msg => msg.from === selectedUser)
    : '';

  return (
    <div style={{ display: 'flex', height: '500px', marginTop:"10rem" }}>
      {/* Coluna da esquerda */}
      <div style={{ width: '30%', borderRight: '1px solid #ccc', overflowY: 'scroll' }}>
        <h3>Usuários</h3>
        {Array.from(new Set(chat.map(msg => msg.from))).map((user, idx) => (
          <div key={idx} onClick={() => handleUserClick(user)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img src={`path/to/icon/${user}.png`} alt={user} style={{ width: '30px', height: '30px', marginRight: '10px' }} />
            <span>{user}</span>
          </div>
        ))}
      </div>
      
      {/* Coluna da direita */}
      <div style={{ width: '70%', padding: '10px', overflowY: 'scroll' }}>
        <h2>Chat com Suporte</h2>
        <div style={{ border: '1px solid #ccc', height: '240px', overflowY: 'scroll' }}>
          {Array.isArray(filteredMessages) && filteredMessages.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.from}:</strong> {msg.message}
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
    </div>
  );
};

export default AdminChat;
