const queryKeys = {
  AUTH: 'auth',
  GET_ACCESS_TOKEN: 'getAccessToken',
  GET_PROFILE: 'getProfile',
  MARKER: 'marker',
  GET_MARKERS: 'getMarkers',
  GET_PETS: 'getPets',
} as const;

const storageKeys = {
  REFRESH_TOKEN: 'refreshtoken',
} as const;

export {queryKeys, storageKeys};
