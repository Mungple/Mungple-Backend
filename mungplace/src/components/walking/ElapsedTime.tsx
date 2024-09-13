import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';

const ElapsedTime = () => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime(prevTime => {
        const [hours, minutes, seconds] = prevTime.split(':').map(Number);
        const newSeconds = (seconds + 1) % 60;
        const newMinutes = (minutes + Math.floor((seconds + 1) / 60)) % 60;
        const newHours = hours + Math.floor((minutes + 1) / 60);
        return `${String(newHours).padStart(2, '0')}:${String(
          newMinutes,
        ).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <ElapsedTimeText>{elapsedTime}</ElapsedTimeText>;
};

const ElapsedTimeText = styled(Text)`
  font-size: 32px;
  font-weight: bold;
  color: #000000;
`;

export default ElapsedTime;
