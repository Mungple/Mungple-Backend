import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {settingNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import {SettingStackParamList} from '@/navigations/stack/SettingStackNavigator';

type MyPageScreenProps = NativeStackScreenProps<SettingStackParamList, typeof settingNavigations.MY_PAGE>;

const MyPageScreen: React.FC<MyPageScreenProps> = ({navigation}) => {

  return (
    <Container>
      <InnerContainer>
        <Section>
          <Text>프로필 사진</Text>
          <Text>닉네임</Text>
        </Section>
        <Section>
          <Text>반려견 목록</Text>
          <Text>반려견1</Text>
          <Text>반려견2</Text>
        </Section>
        <CustomButton
          label="반려견 상세"
          onPress={() => navigation.navigate(settingNavigations.PET_DETAIL)}
        />
        <CustomButton
          label="설정"
          onPress={() => navigation.navigate(settingNavigations.SETTING)}
        />
        <CustomButton
          label="프로필 편집"
          onPress={() => navigation.navigate(settingNavigations.EDIT_PROFILE)}
        />
        <CustomButton label="로그아웃" onPress={() => {}} />
      </InnerContainer>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const InnerContainer = styled.View`
  gap: 20;
`;

const Section = styled.View`
  align-items: center;
  justify-content: center;
`

export default MyPageScreen;
