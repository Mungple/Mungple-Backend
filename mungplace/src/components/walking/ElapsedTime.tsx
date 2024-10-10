import React, { useState, useEffect } from 'react';
import CustomText from '../common/CustomText';
import { colors } from '@/constants';

const ElapsedTime = () => {
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    // 1초마다 시간이 업데이트되도록 설정
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeDiff = now.getTime() - startTime.getTime();

      // 경과 시간을 시, 분, 초로 변환
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      // 시, 분, 초를 다시 문자열로 조합하여 반환
      setElapsedTime(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
          seconds,
        ).padStart(2, '0')}`,
      );
    }, 1000);

    // 컴포넌트가 사라질 때 interval을 정리하여 메모리 누수를 방지
    return () => clearInterval(intervalId);
  }, [startTime]);

  return (
    <CustomText fontWeight="bold" fontSize={22} color={colors.BLACK} style={{ marginVertical: 10 }}>
      {elapsedTime}
    </CustomText>
  );
};

export default ElapsedTime;
