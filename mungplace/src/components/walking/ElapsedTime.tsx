import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';

const ElapsedTime = () => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    // 1초마다 시간이 업데이트되도록 설정
    const intervalId = setInterval(() => {
      setElapsedTime(prevTime => {
        // 현재 시간을 시, 분, 초로 나눔
        const [hours, minutes, seconds] = prevTime.split(':').map(Number);
        const newSeconds = (seconds + 1) % 60;
        const newMinutes = (minutes + (seconds + 1 >= 60 ? 1 : 0)) % 60;
        const newHours = hours + (minutes + 1 >= 60 && newSeconds === 0 ? 1 : 0);

        // 시, 분, 초를 다시 문자열로 조합하여 반환
        return `${String(newHours).padStart(2, '0')}:${String(
          newMinutes,
        ).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
      });
    }, 1000);

    // 컴포넌트가 사라질 때 interval을 정리하여 메모리 누수를 방지
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ElapsedTimeText>
      {elapsedTime}
    </ElapsedTimeText>
  );
};

const ElapsedTimeText = styled(Text)`
  font-size: 32px;
  font-weight: bold;
  color: #000000;
`;

export default ElapsedTime;
