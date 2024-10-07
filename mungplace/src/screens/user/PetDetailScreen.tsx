import React, { useState } from 'react';
import { Alert, Image as RNImage } from 'react-native';
import styled from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';

import { colors } from '@/constants';
import PetForm from '@/components/user/PetForm';
import { calculateAge } from '@/hooks/usePetAge';
import DefaultImage from '@/assets/profile-image.png';
import CustomModal from '@/components/common/CustomModal';
import CustomModalHeader from '@/components/common/CustomModalHeader';
import { SettingStackParamList } from '@/navigations/stack/SettingStackNavigator';
import usePet from '@/hooks/queries/usePet';
import CustomText from '@/components/common/CustomText';

type PetDetailRouteProp = RouteProp<SettingStackParamList, 'PetDetail'>;

const changeGtoKg = (weight: number) => {
  const kg = weight / 1000;
  return kg.toFixed(2);
};

const PetDetailScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const route = useRoute<PetDetailRouteProp>();
  const { deletePetMutation } = usePet();
  const navigation = useNavigation();
  const { petData } = route.params;

  const deletePet = async () => {
    deletePetMutation.mutate(petData.id);
    navigation.goBack();
  };

  const handleDelete = async () => {
    Alert.alert(
      '삭제 확인',
      '정말로 이 반려동물을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: deletePet,
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <Container>
      <Image
        source={
          petData.photo
            ? { uri: `http://j11e106.p.ssafy.io:9000/images/${petData.photo}` }
            : DefaultImage
        }
      />
      <Column>
        <Row>
          <Title>이름</Title>
          <CustomText fontWeight="bold" fontSize={22}>
            {petData.name}
          </CustomText>
        </Row>
        <Row>
          <Title>성별</Title>
          <CustomText fontWeight="bold" fontSize={22}>
            {petData.gender === 'MALE' ? '남아' : '여아'}
          </CustomText>
        </Row>
        <Row>
          <Title>나이</Title>
          <CustomText fontWeight="bold" fontSize={22}>
            {calculateAge(petData.birth)}개월
          </CustomText>
        </Row>
        <Row>
          <Title>몸무게</Title>
          <CustomText fontWeight="bold" fontSize={22}>
            {changeGtoKg(petData.weight)}kg
          </CustomText>
        </Row>
      </Column>
      <ButtonContainer>
        <ActionButton onPress={() => setModalVisible(true)}>
          <CustomText fontWeight="bold" fontSize={18} color={colors.WHITE}>
            변경
          </CustomText>
        </ActionButton>
        <ActionButton onPress={handleDelete} danger>
          <CustomText fontWeight="bold" fontSize={18} color={colors.WHITE}>
            삭제
          </CustomText>
        </ActionButton>
      </ButtonContainer>

      <CustomModal isWide={true} modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <CustomModalHeader title="반려견 정보 변경" closeButton={() => setModalVisible(false)} />
        <PetForm petData={petData} setModalVisible={setModalVisible} />
      </CustomModal>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.WHITE};
`;

const Column = styled.View`
  flex: 1;
`;

const Row = styled.View`
  gap: 100px;
  margin: 10px 0;
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled(CustomText)`
  font-size: 20px;
  color: ${colors.BLACK};
`;

const Image = styled(RNImage)`
  width: 160px;
  height: 160px;
  border-radius: 80px;
  margin: 100px 0;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

const ActionButton = styled.TouchableOpacity<{ danger?: boolean }>`
  flex: 1;
  padding: 15px;
  margin: 0 5px;
  background-color: ${(props) => (props.danger ? colors.RED.BASE : colors.ORANGE.BASE)};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

export default PetDetailScreen;
