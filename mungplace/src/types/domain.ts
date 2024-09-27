// 마커의 색상을 특정 값으로 제한하기 위해 사용
type MarkerColor = 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'PURPLE';

// MarkerColor 타입의 색상들을 키로 가지고, 그에 해당하는 string 값을 가질 수 있도록 함
type Category = {
  [key in MarkerColor]: string;
};

// 이미지 URI를 나타내는 타입 정의
interface ImageUri {
  id?: number;
  uri: string;
}

// 지도 마커 정보를 정의한 타입
interface Marker {
  id: number;
  latitude: number;
  longitude: number;
  color: MarkerColor;
  score: number;
}

// Marker 정보를 확장하여 게시물(Post) 정보를 정의한 타입
interface Post extends Marker {
  title: string;
  address: string;
  date: Date | string;
  description: string;
}

// 사용자 프로필 정보를 정의한 타입
interface Profile {
  userId: number;
  nickname: string;
  imageName: string | null;
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
  default: boolean;
  name: string;
  gender: string;
  weight: number;
  birth: string;
  photoId: string | null;
};

interface Exploration {
  explorationId: number;
  distance: number;
  startAt: string;
  endAt: string;
}

export type {
  Post,
  Marker,
  Profile,
  ImageUri,
  Category,
  Exploration,
  MarkerColor,
  RequestPetProfile,
  ResponsePetProfile,
};
