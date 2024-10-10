import { alerts } from '@/constants';
import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { check, request, Permission, RESULTS, PERMISSIONS, requestMultiple } from 'react-native-permissions';

// 권한 유형 정의
type PermissionType = 'LOCATION' | 'BACKGROUND_LOCATION' | 'PHOTO' | 'CAMERA';

// 안드로이드 권한 정의
const androidPermissons: { [key in PermissionType]: Permission } = {
  CAMERA: PERMISSIONS.ANDROID.CAMERA,
  PHOTO: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
  LOCATION: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  BACKGROUND_LOCATION: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
};

// 위치 권한을 포함하는 배열
const allLocationPermissions = [
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, // GPS 권한
  PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, // 네트워크 위치 권한
];

const usePermission = (type: PermissionType) => {
  useEffect(() => {
    (async () => {
      // 현재 권한 상태 확인
      const checked = await check(androidPermissons[type]);

      // 권한이 필요한 경우 경고 알림을 표시하는 함수
      const showPermissonAlert = () => {
        Alert.alert(alerts[`${type}_PERMISSION`].TITLE, alerts[`${type}_PERMISSION`].DESCRIPTION, [
          {
            text: '설정하기',
            onPress: () => Linking.openSettings(),
          },
          {
            text: '취소',
            style: 'cancel',
          },
        ]);
      };

      // 권한 상태에 따른 로직 처리
      switch (checked) {
        // 1. 권한이 거부된 경우 경고 알림만 표시하고 종료
        case RESULTS.DENIED: {
          const result = await request(androidPermissons[type]);

          if (result !== RESULTS.GRANTED) {
            showPermissonAlert();
          }
          return;
        }
        // 2. 권한이 차단되거나 제한된 경우 설정 페이지로 이동하도록 유도
        case RESULTS.BLOCKED:
        case RESULTS.LIMITED:
          showPermissonAlert();
          break;
        // 3. 그 외 (권한이 이미 부여된 경우 등) 아무 작업도 하지 않음
        default:
          break;
      }

      // LOCATION 권한 요청 시, 모든 위치 관련 권한을 한 번에 요청
      if (type === 'LOCATION') {
        const results = await requestMultiple(allLocationPermissions);

        // 각 권한의 상태를 체크하여 거부된 권한 확인
        const notGranted = allLocationPermissions.filter(
          (permission) => results[permission] !== RESULTS.GRANTED,
        );

        // 거부된 권한에 대한 알림 표시
        if (notGranted.length > 0) {
          showPermissonAlert();
        }
      }
    })();
  }, [type]); // type이 변경될 때마다 useEffect 실행
};

export default usePermission;
