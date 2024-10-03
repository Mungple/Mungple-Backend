import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecordScreen from '@/screens/record/RecordScreen';
import WalkListScreen from '@/screens/record/WalkListScreen';
import WalkDetailScreen from '@/screens/record/WalkDetailScreen';

// 일간 산책 목록 인터페이스
interface DayListData {
  explorationId: number; // 산책 ID
  distance: number; // 산책 거리 (예: 미터)
  togertherDogIds: number[]; // 함께한 개의 ID 배열
}

export type RecordStackParamList = {
  Record: undefined;
  WalkList: DayListData[];
  WalkDetail: { explorationId: number };
};

const RecordStack = createNativeStackNavigator<RecordStackParamList>();

const RecordNavigator = () => {
  return (
    <RecordStack.Navigator screenOptions={{ headerShown: false }}>
      <RecordStack.Screen name="Record" component={RecordScreen} />
      <RecordStack.Screen name="WalkList" component={WalkListScreen} />
      <RecordStack.Screen name="WalkDetail" component={WalkDetailScreen} />
    </RecordStack.Navigator>
  );
};

export default RecordNavigator;
