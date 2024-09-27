import axiosInstance from "@/api/axios";
import { useAppStore } from "@/state/useAppStore";

export const managerLogin = async (username : string) => {
  try {
    const response = await axiosInstance.post(`/manager/login?username=${username}`)
    
    if (response.status === 200) {
      const token = response.data.accessToken
      useAppStore.getState().setToken(token) // 토큰 저장
      useAppStore.getState().setLogin(true) // 로그인 
      console.log('토큰입니다', token)
    }
  } catch (error) {
    console.error('로그인 실패', error)
  }
}