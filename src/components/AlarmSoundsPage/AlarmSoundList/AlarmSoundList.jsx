import React from 'react';

const AlarmSoundList = ({ sounds, onPlay, selectedAlarm, onSelect }) => {
  return (
    <div>
      {sounds.map(sound => (
        <div key={sound} style={{ marginBottom: '10px' }}>
          <span>{sound}</span>
          <button onClick={() => onPlay(sound)}>Tocar</button>
          <button 
            onClick={() => onSelect(sound)} 
            style={{ 
              backgroundColor: sound === selectedAlarm ? 'lightgreen' : 'lightgray' 
            }}>
            Selecionar
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlarmSoundList;
