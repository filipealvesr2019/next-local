// ChatContext.js
import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const MessageProvider = ({ children }) => {
  const [fetchMessages, setFetchMessages] = useState(() => () => {});

  return (
    <ChatContext.Provider value={{ fetchMessages, setFetchMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
