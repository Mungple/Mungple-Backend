import type {UserProfile} from '@/types/domain'
import {getEncryptStorage} from '@/utils'
import axiosInstance from './axios'
import {JwtPayload, jwtDecode} from 'jwt-decode'
import {storageKeys} from '@/constants'

interface CustomJwtPayload extends JwtPayload {
  userId: number
}

// 사용자 프로필 요청 타입
type RequestProfile = Omit<UserProfile, 'nickname' | 'imageName'>

// 사용자 프로필 반환 타입
type ResponseProfile = {
  userId: number
  nickname: string
  imageName: string | null
}

// 소셜 로그인 함수
const socialLogin = async (url: string): Promise<string> => {
  const pathSegments = url.split('/')
  const accessToken = pathSegments[pathSegments.length - 1]
  return accessToken
}

// 유저 아이디 해석 함수
const getUserId = async (token: string): Promise<number> => {
  const decodedCode = jwtDecode<CustomJwtPayload>(token)
  const userId = decodedCode.userId
  return userId
}

// 프로필 정보 요청 함수
const getProfile = async (userId: number): Promise<ResponseProfile> => {
  try {
    const {data} = await axiosInstance.get(`/users/${userId}`, {
      headers: {
        'Content-Type': `application/json; charset=utf8`,
      },
    })
    console.log('프로필 정보 요청 성공')
    return data
  } catch (error) {
    console.error('프로필 정보 요청 실패 :', error)
    throw error
  }
}

// 프로필 정보 변경 함수
const editProfile = async (userId: number, body: RequestProfile): Promise<ResponseProfile> => {
  const {data} = await axiosInstance.patch(`/users/${userId}`, body)
  return data
}

// 액세스 토큰 요청 함수
const getAccessToken = async (): Promise<string> => {
  const accessToken = await getEncryptStorage(storageKeys.ACCESS_TOKEN)
  return accessToken
}

// 로그아웃 요청 함수
const logout = async () => {
  try {
    await axiosInstance.post('/users/logout')
  } catch (error) {
    console.error('로그아웃 실패 :', error)
    throw error
  }
}

export {editProfile, getAccessToken, getProfile, logout, socialLogin, getUserId}
export type {RequestProfile, ResponseProfile}
