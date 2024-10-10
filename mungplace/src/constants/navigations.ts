const mainNavigations = {
  HOME: 'Home',
  MAP: 'Map',
  RECORD: 'Record',
  MYPAGE: 'MyPage',
} as const;

const authNavigations = {
  AUTH_HOME: 'AuthHome',
  SOCIAL_LOGIN: 'SocialLogin',
  POST_PROFILE: 'PostProfile',
  POST_PROFILE_PET: 'InputPet',
  SPLASH: 'SplashScreen',
  EASTER_EGG: 'EasterEgg',
} as const;

const mapNavigations = {
  COUNTDOWN: 'CountDown',
  WALKING: 'Walking',
  HOME: 'MapHome',
  MARKERDETAIL: 'MarkerDetail',
  MYMARKERLIST: 'MyMarkerList',
  FACILITYDETAIL: 'FacilityDetail',
} as const;

const settingNavigations = {
  MY_PAGE: 'MyPageHome',
  SETTING: 'Setting',
  PET_DETAIL: 'PetDetail',
  EDIT_PROFILE: 'EditProfile',
  DELETE_ACCOUNT: 'DeleteAccount',
} as const;

export { mainNavigations, authNavigations, mapNavigations, settingNavigations };
