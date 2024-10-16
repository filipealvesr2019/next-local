import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3002', {
  transports: ['websocket', 'polling'],
});

const AdminChat = () => {
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('clientMessage', (clientMessage) => {
      setChat((prevChat) => [...prevChat, { from: 'Cliente', text: clientMessage }]);
    });

    return () => {
      socket.off('clientMessage');
    };
  }, []);

  return (
    <div>
      <h2>Chat com Clientes</h2>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll' }}>
        {chat.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.from}:</strong> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChat;
