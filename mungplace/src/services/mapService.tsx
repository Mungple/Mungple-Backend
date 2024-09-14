export const fetchPersonalBlueZoneAPI = async (latitude: number, longitude: number) => {
  const response = await fetch(`/users/{userId}/bluezone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: 'currentUserId',  // 실제 사용자 ID로 대체
      latitude,
      longitude,
      radius: 500,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    }),
  });
  return await response.json();
};

export const fetchGlobalBlueZoneAPI = async (latitude: number, longitude: number) => {
  const response = await fetch(`/bluezone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      latitude,
      longitude,
      radius: 500,
    }),
  });
  return await response.json();
};

export const fetchRedZoneAPI = async (latitude: number, longitude: number) => {
  const response = await fetch(`/redzone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      latitude,
      longitude,
      radius: 500,
    }),
  });
  return await response.json();
};

export const fetchMungPlaceAPI = async () => {
  const response = await fetch(`/mungplace`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
};
