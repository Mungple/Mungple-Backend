const calculateTime = (time: number) => {
  const hour = Math.floor(time / 60);
  const minute = time % 60;
  return `${hour}시간 ${minute}분`;
};

const calculateDistance = (distance: number) => {
  const km = distance / 1000; // 미터를 킬로미터로 변환
  return km.toFixed(2); // 소수점 둘째 자리까지 표시
};

export { calculateTime, calculateDistance };
