const mainNavigations = {
  HOME: 'Home',
  MAP: 'Map',
  RECORD: 'Record',
  RANKING: 'Ranking',
  MYPAGE: 'MyPage',
} as const;

const authNavigations = {
  AUTH_HOME: 'AuthHome',
  SOCIAL_LOGIN: 'SocialLogin',
  POST_PROFILE: 'PostProfile',
  POST_PROFILE_PET: 'InputPet',
} as const;

const mapNavigations = {
  WALKING: 'Walking',
  HOME: 'MapHome',
} as const;

const settingNavigations = {
  MY_PAGE: 'MyPageHome',
  SETTING: 'Setting',
  PET_DETAIL: 'PetDetail',
  EDIT_PROFILE: 'EditProfile',
  DELETE_ACCOUNT: 'DeleteAccount',
} as const;

export {
  mainNavigations,
  authNavigations,
  mapNavigations,
  settingNavigations,
};
