import React, { useEffect, useState } from "react";
import AlarmSoundList from "./AlarmSoundList/AlarmSoundList";
import Cookies from "js-cookie";
import axios from "axios";
import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
const AlarmSoundsPage = () => {
  const [sounds, setSounds] = useState([]);
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do admin do cookie

  useEffect(() => {
    // Certificar-se de que o adminID está definido
    if (!AdminID) {
      console.error("adminID não encontrado nos cookies.");
      return;
    }

    // Função para buscar os sons configurados por adminID
    const fetchSounds = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/alarms/list/${AdminID}`
        );
        const data = response.data; // O axios já retorna o JSON
        setSounds(data.sounds); // Atualiza os sons
        setSelectedAlarm(data.selectedAlarm); // Atualiza o som selecionado pelo admin
        setIsAlarmActive(data.isAlarmActive); // Atualiza o estado de ativação
      } catch (error) {
        console.error("Erro ao buscar sons:", error);
      }
    };

    fetchSounds();
  }, [AdminID]);

  const playAudio = (filename) => {
    const audio = new Audio(`http://localhost:3002/api/audio/play/${filename}`);
    audio.play().catch((error) => {
      console.error("Erro ao reproduzir o som:", error);
    });
  };

  const handleSelectAlarm = async (alarmSound) => {
    try {
      await axios.post("http://localhost:3002/api/alarms", {
        adminID: AdminID,
        alarmSound,
        isAlarmActive
      });
      setSelectedAlarm(alarmSound); // Atualiza o alarme selecionado no estado
    } catch (error) {
      console.error("Erro ao selecionar o alarme:", error);
    }
  };

  return (
    <div style={{ marginTop: "10rem" }}>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="alert-on-off" mb="0">
          Ativar alarme?
        </FormLabel>
        <Switch id="alert-on-off" />
      </FormControl>
      <h1>Sons de Alarme</h1>
      {/* Componente de lista de sons */}
      <AlarmSoundList
        sounds={sounds}
        onPlay={playAudio} // Passando a função playAudio corretamente
        selectedAlarm={selectedAlarm}
        isAlarmActive={isAlarmActive}
        onSelect={handleSelectAlarm} // Passando a função de seleção de alarme
      />
    </div>
  );
};

export default AlarmSoundsPage;
