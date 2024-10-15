import React from 'react';

const AlarmSoundList = ({ sounds, onPlay, selectedAlarm, isAlarmActive }) => {
  return (
    <ul>
      {sounds.map((sound, index) => (
        <li key={index}>
          <span>{sound}</span>
          <button onClick={() => onPlay(sound)}>Tocar</button>
          {selectedAlarm === sound && <span> (Selecionado)</span>}
        </li>
      ))}
    </ul>
  );
};

export default AlarmSoundList;
