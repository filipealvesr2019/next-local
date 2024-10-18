import React from 'react';
import styles from './ChatLoading.module.css';

const ChatLoading = () => {
  return (
    <div className={styles.chatLoading}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );
};

export default ChatLoading;
