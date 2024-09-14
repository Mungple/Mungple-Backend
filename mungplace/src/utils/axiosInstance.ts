// Axios 인스턴스의 공통 헤더를 동적으로 설정하거나 제거하는 유틸리티 함수 정의
// 애플리케이션 전체에서 Axios를 통해 보내는 HTTP 요청에 필요한 헤더를 중앙에서 관리
import axiosInstance from '@/api/axios';

// Axios 인스턴스의 공통 헤더에 새로운 헤더를 추가하거나 기존 헤더를 업데이트하는 함수
function setHeader(key: string, value: string) {
  axiosInstance.defaults.headers.common[key] = value;
}

// Axios 인스턴스의 공통 헤더에서 특정 헤더를 제거하는 함수
function removeHeader(key: string) {
  if (!axiosInstance.defaults.headers.common[key]) {
    return;
  }
  delete axiosInstance.defaults.headers.common[key];
}

export {setHeader, removeHeader};
