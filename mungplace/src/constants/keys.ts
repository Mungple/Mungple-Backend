const queryKeys = {
  AUTH: 'auth',
  GET_ACCESS_TOKEN: 'getAccessToken',
  GET_PROFILE: 'getProfile',
  GET_USER_ID: 'getUserId',
  GET_PETS: 'getPets',
} as const

const storageKeys = {
  ACCESS_TOKEN: 'accesstoken',
  REFRESH_TOKEN: 'refreshtoken',
} as const

export {queryKeys, storageKeys}
