// Axios 인스턴스의 공통 헤더를 동적으로 설정하거나 제거하는 유틸리티 함수 정의
// 인증 토큰의 동적 관리 및 반복적인 코드 작성 최소화
import axiosInstance from '@/api/axios'

// Axios 인스턴스의 공통 헤더에 새로운 헤더를 추가하거나 기존 헤더를 업데이트하는 함수
function setHeader(key: string, value: string) {
  axiosInstance.defaults.headers.common[key] = value
}

// Axios 인스턴스의 공통 헤더에서 특정 헤더를 제거하는 함수
function removeHeader(key: string) {
  if (!axiosInstance.defaults.headers.common[key]) {
    return
  }
  delete axiosInstance.defaults.headers.common[key]
}

export {setHeader, removeHeader}
