import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Conectar ao servidor Socket.IO

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState('Cliente');

  // Receber mensagem
  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });
  }, []);

  // Enviar mensagem
  const sendMessage = (e) => {
    e.preventDefault();
    const data = {
      from: username, // Você pode alterar dinamicamente para o admin ou cliente
      to: 'Admin',
      message,
    };
    socket.emit('sendMessage', data);
    setChat((prevChat) => [...prevChat, data]);
    setMessage('');
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        <ul>
          {chat.map((msg, index) => (
            <li key={index}>
              <strong>{msg.from}: </strong>
              {msg.message}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Chat;
