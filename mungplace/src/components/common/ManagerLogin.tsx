import {getPetProfiles} from '@/api'
import axiosInstance from '@/api/axios'
import {useAppStore} from '@/state/useAppStore'
import {useUserStore} from '@/state/useUserStore'
import {setHeader} from '@/utils'
import {JwtPayload, jwtDecode} from 'jwt-decode'

interface CustomJwtPayload extends JwtPayload {
  userId: number
}

export const managerLogin = async (username: string) => {
  try {
    const response = await axiosInstance.post(`/manager/login?username=${username}`)

    if (response.status === 200) {
      const token = response.data.accessToken
      const {setUserId, setPetData} = useUserStore.getState()

      useAppStore.getState().setToken(token) // 토큰 저장
      useAppStore.getState().setLogin(true) // 로그인
      setHeader('Authorization', `Bearer ${token}`)
      console.log('토큰입니다', token)
      const decoded = jwtDecode<CustomJwtPayload>(`${token}`)
      setUserId(decoded.userId)

      const getPetProfile = async () => {
        const data = await getPetProfiles(decoded.userId)
        setPetData(data)
      }
      getPetProfile()
    }
  } catch (error) {
    console.error('로그인 실패', error)
  }
}
