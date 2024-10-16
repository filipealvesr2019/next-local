import React, { useEffect, useState } from "react";
import AlarmSoundList from "./AlarmSoundList/AlarmSoundList";
import Cookies from "js-cookie";
import axios from "axios";
import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import AlarmComponent from "../AlarmComponent/AlarmComponent";
import { useConfig } from "../../../../../context/ConfigContext";

const AlarmSoundsPage = () => {
  const [sounds, setSounds] = useState([]);
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do admin do cookie
  const { apiUrl } = useConfig();
  const [storeID, setStoreID] = useState(null); // Inicializa como null até ser recuperado

  useEffect(() => {
    const handleGetEcommerce = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/loja/admin/${AdminID}`);
        const retrievedStoreID = response.data._id;
        setStoreID(retrievedStoreID); // Define o storeID quando recuperado da API
        console.log('handleGetEcommerce', retrievedStoreID); // Verifique o valor aqui
      } catch (error) {
        console.error("Erro ao buscar a loja:", error);
      }
    };
  
    if (AdminID) {
      handleGetEcommerce();
    }
  }, [AdminID]); // Adiciona o useEffect separado para a busca da loja


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
    if (!storeID) {
        console.error("storeID não está definido."); // Verifique se storeID é null
        return; // Impede a execução se o storeID não estiver definido
      }
    
      console.log("storeID:", storeID); // Adiciona log para verificar o valor de storeID
    try {
      await axios.post("http://localhost:3002/api/alarms", {
        adminID: AdminID,
        storeID: storeID,
        alarmSound,
        isAlarmActive,
        
      });
      setSelectedAlarm(alarmSound); // Atualiza o alarme selecionado no estado
    } catch (error) {
      console.error("Erro ao selecionar o alarme:", error);
    }
  };

  const handleToggleAlarm = async () => {
    try {
      const response = await axios.post("http://localhost:3002/api/alarms/toggle", {
        adminID: AdminID,
      });
      setIsAlarmActive(response.data.isAlarmActive); // Atualiza o estado de ativação do alarme
    } catch (error) {
      console.error("Erro ao alternar o estado do alarme:", error);
    }
  };

  
  return (
    <div style={{ marginTop: "10rem" }}>
    <AlarmComponent />
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="alert-on-off" mb="0">
          Ativar alarme?
        </FormLabel>
        <Switch
          id="alert-on-off"
          isChecked={isAlarmActive} // Define o estado do switch
          onChange={handleToggleAlarm} // Chama a função ao alternar o switch
        />
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
