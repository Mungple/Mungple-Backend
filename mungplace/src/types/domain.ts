import { JwtPayload } from 'jwt-decode';

// 사용자 프로필 정보를 정의한 타입
interface ResponseUserProfile {
  userId: number;
  nickname: string;
  imageName: string | null;
  createdAt: string;
}

// 반려견 프로필 등록 요청을 정의한 타입
interface RequestPetProfile {
  petName: string;
  petGender: string;
  petWeight: number;
  petBirth: string;
}

// 반려견 프로필 조회 응답을 정의한 타입
interface ResponsePetProfile {
  id: number;
  isDefault: boolean;
  name: string;
  gender: string;
  weight: number;
  birth: string;
  photo: string | null;
}

interface StartExplorate {
  explorationId: number;
  startAt: Date;
}

interface Exploration {
  explorationId: number;
  distance: number;
  startAt: string;
  endAt: string;
}

interface Distance {
  distance: number;
}

interface Location {
  lat: number;
  lon: number;
}

interface CustomJwtPayload extends JwtPayload {
  userId: number;
}

export type {
  Location,
  Distance,
  Exploration,
  StartExplorate,
  CustomJwtPayload,
  RequestPetProfile,
  ResponsePetProfile,
  ResponseUserProfile,
};
