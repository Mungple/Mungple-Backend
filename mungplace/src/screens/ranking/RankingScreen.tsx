import { View, Text } from 'react-native';
import React from 'react';
import CustomHeader from '@/components/common/CustomHeader';
import TestSocket from '@/components/TestSocket';

const RankingScreen = () => {
  return (
    <View>
      <CustomHeader title="랭킹" />
      <Text>RankingScreen</Text>
      <TestSocket />
    </View>
  );
};

export default RankingScreen;
