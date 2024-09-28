import axiosInstance from './axios';

interface MonthWorks {
  month: number;
  year: number;
}

// 산책 시작 함수
const startWalk = async (JSON: string) => {
  try {
    const {data} = await axiosInstance.post(`/explorations`, JSON, {
      headers: {
        'Content-Type': `application/json; charset=utf8`,
      },
    });
    return data;
  } catch (error) {
    console.log('산책 시작 실패 :', error);
    throw error;
  }
};

// 산책 종료 함수
const exitWalk = async (explorationId: number) => {
  const {data} = await axiosInstance.post(`/explorations/${explorationId}`);
  return data;
};

// 월간 산책 기록 목록 조회 함수
const getMonthWalks = async (year: number, month: number) => {
  try {
    const {data} = await axiosInstance.get(`/explorations`, {
      params: {
        year: year,
        month: month,
      } as MonthWorks,
    });
    console.log('월간 산책 기록 목록 조회 성공 :', data);
    return data;
  } catch (error) {
    console.error('월간 산책 기록 목록 조회 실패 :', error);
    throw error;
  }
};

// 일간 산책 기록 목록 조회 함수
const getDateWalks = async () => {
  const {data} = await axiosInstance.get(`/explorations/days`);
  return data;
};

// 산책 기록 목록 통계 조회 함수
const getStatistics = async () => {
  const {data} = await axiosInstance.get(`/explorations/statistics`);
  return data;
};

// 산책 기록 상세 조회 함수
const getWalkDetail = async (explorationId: number) => {
  const {data} = await axiosInstance.get(`/explorations/${explorationId}`);
  return data;
};

export {
  startWalk,
  exitWalk,
  getMonthWalks,
  getDateWalks,
  getStatistics,
  getWalkDetail,
};
