// 이미지 URI를 나타내는 타입 정의
interface ImageUri {
  id?: number;
  uri: string;
}

// 사용자 프로필 정보를 정의한 타입
interface UserProfile {
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

export type {
  Exploration,
  ImageUri,
  RequestPetProfile,
  ResponsePetProfile,
  StartExplorate,
  UserProfile,
};
