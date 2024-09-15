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
  id: number;
  email: string;
  nickname: string | null;
  imageUri: string | null;
  kakaoImageUri: string | null;
  loginType: 'kakao' | 'naver' | 'google';
}

export type {MarkerColor, Category, ImageUri, Profile, Marker, Post};
