import React, { useState } from 'react';
import styles from './ColorCircle.module.css';

const ColorCircle = ({ color, onChange }) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleColorChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.colorCircleWrapper}>
      <div
        className={styles.colorCircle}
        style={{ backgroundColor: color }}
        onClick={() => setIsPickerVisible(!isPickerVisible)}
      />
      {isPickerVisible && (
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          onBlur={() => setIsPickerVisible(false)}
          className={styles.colorInput}
        />
      )}
    </div>
  );
};

export default ColorCircle;
