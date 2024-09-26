import axiosInstance from './axios';


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
    console.log('반려견 정보 등록 실패 :', error)
    throw error
  }
};

// 산책 종료 함수
const exitWalk = async (explorationId: number) => {
  const {data} = await axiosInstance.post(`/explorations/${explorationId}`);
  return data;
};

// 월간 산책 기록 목록 조회 함수
const getMonthWalks = async () => {
  const {data} = await axiosInstance.get(`/explorations`);
  return data;
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


export {startWalk, exitWalk, getMonthWalks, getDateWalks, getStatistics, getWalkDetail};
