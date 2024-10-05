import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecordScreen from '@/screens/record/RecordScreen';
import WalkListScreen from '@/screens/record/WalkListScreen';
import WalkDetailScreen from '@/screens/record/WalkDetailScreen';

// 일간 산책 목록 인터페이스
interface DayListData {
  explorationId: number; // 산책 ID
  distance: number; // 산책 거리 (예: 미터)
  togetherDogIds: number[]; // 함께한 개의 ID 배열
}

export type RecordStackParamList = {
  RecordScreen: undefined;
  WalkList: { dayListData: DayListData[] };
  WalkDetail: { explorationId: number };
};

const RecordStack = createNativeStackNavigator<RecordStackParamList>();

const RecordStackNavigator = () => {
  return (
    <RecordStack.Navigator>
      <RecordStack.Screen
        name="RecordScreen"
        component={RecordScreen}
        options={{ headerTitle: '월간 산책' }}
      />
      <RecordStack.Screen
        name="WalkList"
        component={WalkListScreen}
        options={{ headerTitle: '일간 산책' }}
      />
      <RecordStack.Screen
        name="WalkDetail"
        component={WalkDetailScreen}
        options={{ headerTitle: '산책 정보' }}
      />
    </RecordStack.Navigator>
  );
};

export default RecordStackNavigator;
