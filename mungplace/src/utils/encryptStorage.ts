// 암호화된 저장소에 데이터를 저장하고, 불러오고, 삭제하는 기능 제공
import EncryptedStorage from 'react-native-encrypted-storage';

// 데이터 저장 함수: 주어진 키와 데이터를 암호화된 저장소에 저장
const setEncryptStorage = async <T>(key: string, data: T) => {
  // key와 데이터를 문자열(JSON)로 변환하여 암호화된 저장소에 저장
  await EncryptedStorage.setItem(key, JSON.stringify(data));
};

// 데이터 불러오기 함수: 주어진 키로 저장된 데이터를 가져옴
const getEncryptStorage = async (key: string) => {
  const storedData = await EncryptedStorage.getItem(key);

  // 데이터를 JSON 형식으로 파싱하여 반환, 데이터가 없으면 null 반환
  return storedData ? JSON.parse(storedData) : null;
};

// 데이터 삭제 함수: 주어진 키로 저장된 데이터를 확인하고, 있다면 삭제
const removeEncryptStorage = async (key: string) => {
  const data = await getEncryptStorage(key);
  // 데이터가 있을 경우 해당 키의 데이터를 삭제
  if (data) {
    await EncryptedStorage.removeItem(key);
  }
};

export {setEncryptStorage, getEncryptStorage, removeEncryptStorage};
