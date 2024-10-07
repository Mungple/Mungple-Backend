import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import { startWalk } from '@/api/walk';
import { useAppStore } from '@/state/useAppStore';
import { useUserStore } from '@/state/useUserStore';

import usePet from '@/hooks/queries/usePet';
import HomeScreen from '@/screens/home/HomeScreen';
import useUserLocation from '@/hooks/useUserLocation';

// 모킹 (Mocking) API 및 Hooks
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/api/walk', () => ({
  startWalk: jest.fn(),
}));

jest.mock('@/state/useAppStore', () => ({
  useAppStore: jest.fn(),
}));

jest.mock('@/state/useUserStore', () => ({
  useUserStore: {
    getState: jest.fn(),
  },
}));

jest.mock('@/hooks/queries/usePet', () => ({
  __esModule: true,
  default: jest.fn(),
  usePet: jest.fn(),
}));

jest.mock('@/hooks/useUserLocation', () => ({
  __esModule: true,
  default: jest.fn(),
  useUserLocation: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('HomeScreen', () => {
  // 모의 네비게이션, 상태 관리 함수, API 호출을 위한 모킹 함수
  const navigationMock = { navigate: jest.fn() };
  const setWalkingStartMock = jest.fn();
  const setStartExplorateMock = jest.fn();
  const startWalkMock = startWalk as jest.Mock;

  // 모킹 설정 함수: 각 테스트 케이스에서 사용될 기본적인 모킹 설정을 수행
  const setupMocks = ({
    userLocation = { latitude: 37.7749, longitude: -122.4194 },
    isUserLocationError = false,
    petData = [
      {
        birth: '2022-02-22',
        gender: 'MALE',
        id: 1,
        isDefault: true,
        name: '멍멍이',
        photo: 'ea137b02-61c7-421a-a3c4-86f10c3a9cd2.jpg',
        weight: 22,
      },
    ],
  } = {}) => {
    // 네비게이션 모킹 설정
    (useNavigation as jest.Mock).mockReturnValue(navigationMock);
    // 상태 관리 함수 모킹 설정
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      setWalkingStart: setWalkingStartMock,
      setStartExplorate: setStartExplorateMock,
    });
    // 사용자 정보 모킹 설정
    (useUserStore.getState as jest.Mock).mockReturnValue({
      userId: 1,
    });
    // 펫 정보 모킹 설정
    (usePet as jest.Mock).mockReturnValue({
      useGetPet: jest.fn().mockReturnValue({
        data: petData,
      }),
    });
    // 사용자 위치 정보 모킹 설정
    (useUserLocation as jest.Mock).mockReturnValue({
      userLocation,
      isUserLocationError,
    });
  };

  // 각 테스트 전에 모킹 함수 초기화
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  // 기본 반려견 정보 및 이미지를 렌더링하는지 테스트
  it('renders default pet info and image', () => {
    const { getByText } = render(<HomeScreen />);

    // 반려견의 이름이 제대로 표시되는지 확인
    expect(getByText('멍멍이')).toBeTruthy();

    // 반려견의 성별이 제대로 표시되는지 확인
    expect(getByText('남아')).toBeTruthy();

    // 반려견의 나이가 제대로 표시되는지 확인
    expect(getByText('32개월')).toBeTruthy();

    // 반려견의 몸무게가 제대로 표시되는지 확인
    expect(getByText('22kg')).toBeTruthy();
  });

  // "산책 시작하기" 버튼을 눌렀을 때 모달이 표시되는지 테스트
  it('shows the modal when the "산책 시작하기" button is pressed', () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    // 모달 표시 버튼 클릭
    fireEvent.press(getByText('산책 시작하기'));
    // 모달이 표시되었는지 확인
    expect(getByTestId('modal')).toBeTruthy();
  });

  // 펫 선택이 제대로 동작하는지 테스트
  it('handles pet selection correctly', () => {
    const { getByTestId } = render(<HomeScreen />);

    // 특정 펫 선택 버튼 클릭
    fireEvent.press(getByTestId('select-pet-1'));
    // 선택된 상태가 반영되었는지 확인
    expect(getByTestId('select-pet-1')).toHaveProperty('selected', true);
  });

  // 반려견이 선택되고 위치 정보가 있을 때 산책이 시작되는지 테스트
  it('starts the walk when pets are selected and location is available', async () => {
    const { getByText } = render(<HomeScreen />);

    // 모달 열기 및 산책 시작 버튼 클릭
    fireEvent.press(getByText('산책 시작하기'));
    fireEvent.press(getByText('산책 시작하기'));

    // 산책 시작 API 호출 여부 확인
    await waitFor(() => expect(startWalkMock).toHaveBeenCalled());

    // 상태 관리 함수 호출 여부 확인
    expect(setWalkingStartMock).toHaveBeenCalledWith(true);
    expect(setStartExplorateMock).toHaveBeenCalled();
    // 네비게이션 호출 여부 확인
    expect(navigationMock.navigate).toHaveBeenCalledWith('WALKING');
  });

  // 위치 권한이 거부되었을 때 경고 메시지가 표시되는지 테스트
  it('shows alert when location permission is denied', async () => {
    setupMocks({ isUserLocationError: true });
    const { getByText } = render(<HomeScreen />);

    // 모달 열기 및 산책 시작 버튼 클릭
    fireEvent.press(getByText('산책 시작하기'));
    fireEvent.press(getByText('산책 시작하기'));

    // 경고 메시지 호출 여부 확인
    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith('Error', '위치 권한을 허용해주세요'),
    );
  });

  // 반려견이 선택되지 않았을 때 경고 메시지가 표시되는지 테스트
  it('shows alert when no pets are selected', async () => {
    setupMocks({ petData: [] });
    const { getByText } = render(<HomeScreen />);

    // 모달 열기 및 산책 시작 버튼 클릭
    fireEvent.press(getByText('산책 시작하기'));
    fireEvent.press(getByText('산책 시작하기'));

    // 경고 메시지 호출 여부 확인
    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Error', '반려견을 선택해주세요'));
  });
});
