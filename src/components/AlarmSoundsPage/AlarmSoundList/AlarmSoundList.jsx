import React from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
const AlarmSoundList = ({ sounds, onPlay, selectedAlarm, isAlarmActive }) => {
  return (
    <ul>
      {sounds.map((sound, index) => (
        <li key={index}>
          <span>{sound}</span>
          <PlayArrowIcon onClick={() => onPlay(sound)} />
          {selectedAlarm === sound && <span> (Selecionado)</span>}
        </li>
      ))}
    </ul>
  );
};

export default AlarmSoundList;
