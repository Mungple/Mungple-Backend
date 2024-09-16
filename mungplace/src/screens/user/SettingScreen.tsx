import React from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';

import {colors} from '@/constants';
import SettingItem from '@/components/setting/SettingItem';

const SettingScreen = () => {
  return (
    <Container>
      <ScrollView>
        <Space />
        <SettingItem title="설정1" onPress={() => {}} />
        <SettingItem title="설정2" onPress={() => {}} />
        <SettingItem title="설정3" subTitle="부제목" onPress={() => {}} />
        <SettingItem
          title="설정4"
          onPress={() => {}}
          color={colors.RED.DARKER}
        />
      </ScrollView>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Space = styled.View`
  height: 30px;
`;

export default SettingScreen;
