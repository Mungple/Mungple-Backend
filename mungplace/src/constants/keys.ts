const queryKeys = {
  AUTH: 'auth',
  GET_ACCESS_TOKEN: 'getAccessToken',
  GET_PROFILE: 'getProfile',
  MARKER: 'marker',
  GET_MARKERS: 'getMarkers',
  POST: 'post',
  GET_POST: 'getPost',
  GET_POSTS: 'getPosts',
  FAVORITE: 'favorite',
} as const;

const storageKeys = {
  REFRESH_TOKEN: 'refreshtoken',
} as const;

export {queryKeys, storageKeys};
