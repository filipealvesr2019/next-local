import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client'; // Use named import
import axios from 'axios';
import Cookies from "js-cookie";

localStorage.debug = '*'; // Habilitar logs de depuração
const socket = io('http://localhost:3002', {
  transports: ['polling', 'websocket'],
});

const AlarmComponent = () => {
  const [alarm, setAlarm] = useState(null); // State to store alarm
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO');
    });
  
    socket.on('disconnect', () => {
      console.log('Desconectado do servidor Socket.IO');
    });
  
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);
  
  const AdminID = Cookies.get("AdminID"); // Get admin ID from cookie

  useEffect(() => {
    const fetchAlarm = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/alarm/${AdminID}`);
        setAlarm(response.data.alarmSound); // Store alarm in state
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching alarm:", error);
      }
    };

    fetchAlarm(); // Call the function to fetch alarm
  }, [AdminID]);

  useEffect(() => {
    socket.on('alarmSound', (data) => {
      console.log(data.message); // Log message to console
      const audio = new Audio(`http://localhost:3002/api/audio/play/${alarm}`); // Load alarm sound
      audio.play(); // Play alarm sound
    });

    return () => {
      socket.off('alarmSound'); // Clean up event on component unmount
    };
  }, [alarm]); // Add alarm as a dependency to ensure it plays the correct sound

  return (
    <div>
      <h1>Alarm Monitoring</h1>
      {alarm ? (
        <div>
          <p>Alarm Sound: {alarm.alarmSound}</p>
          <p>Alarm Status: {alarm.isAlarmActive ? 'Active' : 'Inactive'}</p>
        </div>
      ) : (
        <p>Loading alarm information...</p>
      )}
    </div>
  );
};

export default AlarmComponent;
