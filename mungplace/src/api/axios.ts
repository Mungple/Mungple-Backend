import axios from 'axios';

// axios 인스턴스를 생성하고, 기본 설정을 적용
const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:8080',  // 기본 URL을 설정 (로컬 개발 서버 주소)
  withCredentials: true,            // 요청 시 쿠키 및 인증 정보를 함께 전송 (CORS를 고려한 설정)
});

export default axiosInstance;
