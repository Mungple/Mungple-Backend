const mainNavigations = {
  HOME: 'Home',
  MAP: 'Map',
  RECORD: 'Record',
  RANKING: 'Ranking',
  MYPAGE: 'MyPage',
} as const;

const authNavigations = {
  AUTH_HOME: 'AuthHome',
  KAKAO: 'Kakao',
  NAVER: 'Naver',
  GOOGLE: 'Google',
  INPUT_USER: 'InputUser',
  INPUT_PET: 'InputPet',
} as const;

const mapNavigations = {
  WALKING: 'Walking',
  HOME: 'Home',
} as const;

export {
  mainNavigations,
  authNavigations,
  mapNavigations,
};
