// 빠른 오류 처리, 예측 가능한 네트워크 상태 처리, 서버 부하 감소를 위함
import {QueryClient} from '@tanstack/react-query'

// 모든 쿼리 관련 상태와 옵션 관리
const queryClient = new QueryClient({
  // 기본 설정 지정
  defaultOptions: {
    // 쿼리실행이 실패했을 때, 재시도하지 않도록 설정
    queries: {
      retry: false,
    },
    // 뮤테이션이 실패했을 때, 재시도하지 않도록 설정
    mutations: {
      retry: false,
    },
  },
})

export default queryClient
