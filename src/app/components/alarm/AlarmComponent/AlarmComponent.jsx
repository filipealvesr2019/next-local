import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Cookies from 'js-cookie';

const AlarmComponent = () => {
  const [alarm, setAlarm] = useState(null); // State to store alarm
  const AdminID = Cookies.get('AdminID'); // Get admin ID from cookie

  useEffect(() => {
    const socket = io('http://localhost:3002', {
      transports: ['polling', 'websocket'],
    });

    socket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO');
    });

    socket.on('disconnect', () => {
      console.log('Desconectado do servidor Socket.IO');
    });

    socket.on('alarmSound', (data) => {
      console.log(data.message); // Log message to console
      if (alarm) { // Ensure alarm is loaded before playing
        const audio = new Audio(`http://localhost:3002/api/audio/play/${alarm}`);
        audio.play(); // Play alarm sound
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('alarmSound'); // Clean up event listeners on component unmount
      socket.disconnect(); // Clean up socket connection
    };
  }, [alarm]);

  useEffect(() => {
    const fetchAlarm = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/alarm/${AdminID}`);
        setAlarm(response.data.alarmSound); // Store alarm in state
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching alarm:', error);
      }
    };

    if (AdminID) { // Only fetch alarm if AdminID exists
      fetchAlarm(); // Call the function to fetch alarm
    }
  }, [AdminID]);

  return (
    <div>
     
    </div>
  );
};

export default AlarmComponent;
