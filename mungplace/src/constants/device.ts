import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const DEVICE_WIDTH = width;
export const DEVICE_HEIGHT = height;

// 필요에 따라 여기서 이벤트 리스너를 추가하여 크기 변경 시 업데이트하는 방법도 고려할 수 있습니다.
