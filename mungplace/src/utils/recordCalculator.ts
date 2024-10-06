// 초을 시간으로 변환하는 함수
const calculateTime = (time: number) => {
  const totalMinutes = Math.floor(time / 60); // 초를 분으로 변환
  const hour = Math.floor(totalMinutes / 60); // 전체 분에서 시간을 계산
  const minute = totalMinutes % 60; // 나머지 분 계산

  if (hour > 0) {
    return `${hour} 시간 ${minute} 분`;
  } else {
    return `${minute} 분`; // 0시간일 경우 분만 반환
  }
};
// m를 km로 변환하는 함수
const calculateDistance = (distance: number) => {
  const km = distance / 1000;
  return `${km.toFixed(2)} km`;
};
// 날짜를 시간으로 변환하는 함수
const processDateToTime = (date: string) => {
  const newDate = new Date(date);
  const hours = newDate.getHours().toString().padStart(2, '0');
  const minutes = newDate.getMinutes().toString().padStart(2, '0');
  return `${hours}시 ${minutes}분`;
};

const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationInMilliseconds = end.getTime() - start.getTime();

  if (durationInMilliseconds < 0) {
    return '시작 시간이 종료 시간보다 늦습니다.';
  }

  const seconds = Math.floor((durationInMilliseconds / 1000) % 60);
  const minutes = Math.floor((durationInMilliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((durationInMilliseconds / (1000 * 60 * 60)) % 24);
  let result = '';

  if (hours > 0) {
    result += `${hours}시간 `;
  }
  if (minutes > 0) {
    result += `${minutes}분 `;
  }
  if (seconds > 0) {
    result += `${seconds}초`;
  }
  return result.trim() || '0초';
};

export { calculateTime, calculateDistance, processDateToTime, calculateDuration };
